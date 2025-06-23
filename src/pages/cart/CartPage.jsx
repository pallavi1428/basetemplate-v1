import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { Trash } from "lucide-react";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/layout/Layout";
import { 
  decrementQuantity, 
  deleteFromCart, 
  incrementQuantity 
} from "../../redux/cartSlice";
import { fireDB } from "../../firebase/FirebaseConfig";
import BuyNowModal from "../../components/buyNowModal/BuyNowModal";

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  const user = JSON.parse(localStorage.getItem("users"));

  // ✅ Redirect if not logged in
  if (!user) return <Navigate to="/login" />;

  // ✅ Memoized calculations
  const cartItemTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );

  // ✅ Cart handlers
  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success("Item removed");
  };

  const handleIncrement = (e, id) => {
    e.preventDefault();
    dispatch(incrementQuantity(id));
    toast.success("Quantity increased");
  };

  const handleDecrement = (e, item) => {
    e.preventDefault();
    if (item.quantity > 1) {
      dispatch(decrementQuantity(item.id));
      toast.success("Quantity decreased");
    } else {
      toast.error("Minimum quantity is 1");
    }
  };

  // ✅ Persist cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Buy Now
  const [addressInfo, setAddressInfo] = useState({
    name: "",
    address: "",
    pincode: "",
    mobileNumber: "",
    time: Timestamp.now(),
    date: new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  });

  const buyNowFunction = async () => {
    if (!addressInfo.name || !addressInfo.address || !addressInfo.pincode || !addressInfo.mobileNumber) {
      return toast.error("All fields are required");
    }

    const orderInfo = {
      cartItems,
      addressInfo,
      email: user?.email,
      userid: user?.uid,
      status: "confirmed",
      time: Timestamp.now(),
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    try {
      await addDoc(collection(fireDB, "order"), orderInfo);
      setAddressInfo({
        name: "",
        address: "",
        pincode: "",
        mobileNumber: "",
      });
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 max-w-7xl lg:px-0">
        <div className="mx-auto max-w-2xl py-8 lg:max-w-7xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>

          <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            {/* Cart Items */}
            <section className="rounded-lg bg-white lg:col-span-8">
              <h2 className="sr-only">Items in your cart</h2>
              <ul className="divide-y divide-gray-200">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <li key={item.id} className="py-6">
                      <div className="flex">
                        <img
                          src={item.productImageUrl}
                          alt={item.title}
                          className="h-24 w-24 rounded-md object-contain sm:h-38 sm:w-38"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-semibold text-black">{item.title}</h3>
                          </div>
                          <p className="text-sm text-gray-500">{item.category}</p>
                          <p className="text-sm font-medium text-gray-900">₹{item.price}</p>

                          <div className="mt-2 flex items-center">
                            <div className="flex min-w-24 items-center">
                              <button 
                                onClick={(e) => handleDecrement(e, item)} 
                                className="h-7 w-7"
                              >
                                -
                              </button>
                              <span className="mx-1 h-7 w-9 rounded-md border text-center flex items-center justify-center">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={(e) => handleIncrement(e, item.id)} 
                                className="h-7 w-7"
                              >
                                +
                              </button>
                            </div>
                            <button 
                              onClick={(e) => { e.preventDefault(); deleteCart(item); }} 
                              className="ml-6 flex items-center text-sm"
                            >
                              <Trash size={12} className="text-red-500" />
                              <span className="ml-1 text-xs font-medium text-red-500">
                                Remove
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="py-6 text-center">Your cart is empty</p>
                )}
              </ul>
            </section>

            {/* Order Summary */}
            <section className="mt-16 rounded-md bg-white lg:col-span-4 lg:mt-0">
              <h2 className="border-b border-gray-200 px-4 py-3 text-lg font-medium text-gray-900">
                Price Details
              </h2>
              <div className="space-y-1 px-2 py-4">
                <div className="flex justify-between">
                  <span>Price ({cartItemTotal} item{cartItemTotal !== 1 ? "s" : ""})</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between py-4">
                  <span>Delivery Charges</span>
                  <span className="text-green-700">Free</span>
                </div>
                <div className="flex justify-between border-y border-dashed py-4">
                  <span className="font-medium">Total Amount</span>
                  <span className="font-medium">₹{cartTotal}</span>
                </div>
              </div>
              <div className="px-2 pb-4">
                <BuyNowModal
                  addressInfo={addressInfo}
                  setAddressInfo={setAddressInfo}
                  buyNowFunction={buyNowFunction}
                />
              </div>
            </section>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
