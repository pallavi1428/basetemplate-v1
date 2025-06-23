import { useContext } from "react";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";

const UserDashboard = () => {
    const user = JSON.parse(localStorage.getItem('users'));
    const { loading, getAllOrder } = useContext(myContext);

    // Filter orders for current user
    const userOrders = getAllOrder.filter((obj) => obj.userid === user?.uid);

    return (
        <Layout>
            <div className="container mx-auto px-4 py-5 lg:py-8">
                {/* User Profile Section */}
                <div className="bg-pink-50 py-5 rounded-xl border border-pink-100 mb-8">
                    <div className="flex justify-center">
                        <img
                            src="https://cdn-icons-png.flaticon.com/128/2202/2202112.png"
                            alt="User avatar"
                            className="h-20 w-20"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/80'}
                        />
                    </div>
                    <div className="space-y-2 mt-4">
                        <h1 className="text-center text-lg">
                            <span className="font-bold">Name: </span>{user?.name || "N/A"}
                        </h1>
                        <h1 className="text-center text-lg">
                            <span className="font-bold">Email: </span>{user?.email || "N/A"}
                        </h1>
                        <h1 className="text-center text-lg">
                            <span className="font-bold">Date: </span>{user?.date || "N/A"}
                        </h1>
                        <h1 className="text-center text-lg">
                            <span className="font-bold">Role: </span>{user?.role || "N/A"}
                        </h1>
                    </div>
                </div>

                {/* Orders Section */}
                <div className="mx-auto max-w-6xl px-2 md:px-0">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-6">Order Details</h2>

                    {loading && (
                        <div className="flex justify-center">
                            <Loader />
                        </div>
                    )}

                    {!loading && userOrders.length === 0 && (
                        <p className="text-center py-10">No orders found</p>
                    )}

                    {!loading && userOrders.map((order) => (
                        <div key={order.id} className="space-y-6 mb-10">
                            {order.cartItems.map((item) => (
                                <div key={`${order.id}-${item.id}`} className="flex flex-col overflow-hidden rounded-xl border border-pink-100 md:flex-row">
                                    {/* Order Info */}
                                    <div className="w-full border-r border-pink-100 bg-pink-50 md:max-w-xs">
                                        <div className="p-8 grid gap-4">
                                            <div>
                                                <div className="text-sm font-semibold text-black">Order Id</div>
                                                <div className="text-sm font-medium text-gray-900">#{item.id}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold">Date</div>
                                                <div className="text-sm font-medium text-gray-900">{item.date}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold">Total Amount</div>
                                                <div className="text-sm font-medium text-gray-900">₹ {Number(item.price * item.quantity).toFixed(2)}</div>
                                            </div>
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
                </div>
            </div>
        </Layout>
    );
};

export default UserDashboard;
