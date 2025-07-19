import { useContext, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import Layout from "../../components/layout/Layout";
import myContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";
import { collection, query, where, getDocs } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";

const UserDashboard = () => {
  const location = useLocation();
  const context = useContext(myContext);
  const { loading, orders } = context;

  const [user, setUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [userNotes, setUserNotes] = useState([]);
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'purchased');

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // Clear the state after using it to prevent sticky behavior
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("users"));
    setUser(localUser);

    if (localUser?.uid) {
      // Fetch user's orders
      if (Array.isArray(orders)) {
        const filtered = orders.filter((order) => order.userid === localUser.uid);
        setUserOrders(filtered);
      }

      // Fetch user's uploaded notes
      fetchUserNotes(localUser.uid);
    }
  }, [orders]);

  const fetchUserNotes = async (userId) => {
    try {
      // First try to fetch notes with uploaderId
      const q = query(
        collection(fireDB, "notes"), 
        where("uploaderId", "==", userId)
      );
      
      const querySnapshot = await getDocs(q);
      const notes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // If no notes found with uploaderId, try the old addedBy field as fallback
      if (notes.length === 0) {
        const fallbackQ = query(
          collection(fireDB, "notes"),
          where("addedBy", "array-contains", userId)
        );
        const fallbackSnapshot = await getDocs(fallbackQ);
        const fallbackNotes = fallbackSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserNotes(fallbackNotes);
      } else {
        setUserNotes(notes);
      }
    } catch (error) {
      console.error("Error fetching user notes:", error);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex justify-center items-center">
          <p className="text-center text-lg">User not found. Please log in again.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-5 lg:py-8">
        {/* Profile */}
        <div className="bg-pink-50 py-5 rounded-xl border border-pink-100 mb-8">
          <div className="flex justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/128/2202/2202112.png"
              alt="User avatar"
              className="h-20 w-20"
              onError={(e) => (e.target.src = "https://via.placeholder.com/80")}
            />
          </div>
          <div className="space-y-2 mt-4">
            <h1 className="text-center text-lg"><span className="font-bold">Name:</span> {user.name || "N/A"}</h1>
            <h1 className="text-center text-lg"><span className="font-bold">Email:</span> {user.email || "N/A"}</h1>
            <h1 className="text-center text-lg"><span className="font-bold">Date:</span> {user.date || "N/A"}</h1>
            <h1 className="text-center text-lg"><span className="font-bold">Role:</span> {user.role || "N/A"}</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'purchased' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('purchased')}
          >
            Purchased Notes
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'myNotes' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('myNotes')}
          >
            My Notes
          </button>
        </div>

        {/* Tab Content */}
        <div className="mx-auto max-w-6xl px-2 md:px-0">
          {loading.orders && (
            <div className="flex justify-center">
              <Loader />
            </div>
          )}

          {/* Purchased Notes Tab */}
          {activeTab === 'purchased' && (
            <>
              <h2 className="text-2xl lg:text-3xl font-bold mb-6">Purchased Notes</h2>
              
              {!loading.orders && userOrders.length === 0 && (
                <p className="text-center py-10">No purchased notes found</p>
              )}

              {!loading.orders && userOrders.map((order) => (
                <div key={order.id} className="space-y-6 mb-10">
                  {order.cartItems.map((item) => (
                    <div key={`${order.id}-${item.id}`} className="flex flex-col overflow-hidden rounded-xl border border-pink-100 md:flex-row">
                      {/* Order Summary */}
                      <div className="w-full border-r border-pink-100 bg-pink-50 md:max-w-xs">
                        <div className="p-8 grid gap-4">
                          <div><div className="text-sm font-semibold">Order Id</div><div className="text-sm font-medium">#{item.id}</div></div>
                          <div><div className="text-sm font-semibold">Date</div><div className="text-sm font-medium">{item.date}</div></div>
                          <div><div className="text-sm font-semibold">Total Amount</div><div className="text-sm font-medium">₹ {Number(item.price * item.quantity).toFixed(2)}</div></div>
                          <div>
                            <div className="text-sm font-semibold">Order Status</div>
                            <div className={`text-sm font-medium ${order.status === 'pending' ? 'text-red-800' : 'text-green-800'}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="p-8">
                          <div className="flex flex-col justify-between space-x-5 py-7 md:flex-row">
                            <div className="flex flex-1 items-stretch">
                              <div className="flex-shrink-0">
                                <img
                                  className="h-40 w-40 rounded-lg border border-gray-200 object-contain"
                                  src={item.productImageUrl}
                                  alt={item.title}
                                />
                              </div>
                              <div className="ml-5 flex flex-col justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-gray-900">{item.title}</p>
                                  <p className="mt-1.5 text-sm font-medium text-gray-500">{item.category}</p>
                                </div>
                                <p className="mt-4 text-sm font-medium text-gray-500">x {item.quantity}</p>
                              </div>
                            </div>
                            <div className="ml-auto flex flex-col items-end justify-between">
                              <p className="text-right text-sm font-bold text-gray-900">₹ {item.price}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}

          {/* My Notes Tab */}
          {activeTab === 'myNotes' && (
            <>
              <h2 className="text-2xl lg:text-3xl font-bold mb-6">My Uploaded Notes</h2>
              
              {userNotes.length === 0 && (
                <p className="text-center py-10">You haven't uploaded any notes yet</p>
              )}

              <div className="overflow-x-auto border rounded-lg bg-white">
                <table className="min-w-full text-sm text-gray-600">
                  <thead className="bg-pink-100 text-pink-600">
                    <tr>
                      <th className="px-4 py-2 text-left">#</th>
                      <th className="px-4 py-2 text-left">Title</th>
                      <th className="px-4 py-2 text-left">Category</th>
                      <th className="px-4 py-2 text-left">Price</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userNotes.map((note, index) => (
                      <tr key={note.id} className="border-b hover:bg-pink-50">
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{note.title || "Untitled"}</td>
                        <td className="px-4 py-2">{note.category || "N/A"}</td>
                        <td className="px-4 py-2">₹{note.price || 0}</td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {note.status || "Active"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;