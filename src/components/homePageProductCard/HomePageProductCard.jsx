import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";
import toast from "react-hot-toast";
import Loader from "../loader/Loader";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/FirebaseConfig"; // adjust path if needed

const HomePageProductCard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);

    const addCart = (item) => {
        dispatch(addToCart(item));
        toast.success("Added to cart");
    };

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Removed from cart");
    };

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        const fetchNotes = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "notes"));
                const notesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setNotes(notesData);
            } catch (error) {
                console.error("Error fetching notes:", error);
                toast.error("Failed to load notes.");
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    return (
        <div className="mt-10">
            <div className="">
                <h1 className="text-center mb-5 text-2xl font-semibold">Available Notes</h1>
            </div>

            <section className="text-gray-600 body-font">
                <div className="container px-5 py-5 mx-auto">
                    <div className="flex justify-center">
                        {loading && <Loader />}
                    </div>
                    <div className="flex flex-wrap -m-4">
                        {(notes.length > 0 ? notes.slice(0, 8) : []).map((item) => {
                            const { id, title, price, previewImageUrl, subject, grade } = item;
                            return (
                                <div key={id} className="p-4 w-full md:w-1/4">
                                    <div className="h-full border border-gray-300 rounded-xl overflow-hidden shadow-md cursor-pointer">
                                        <img
                                            onClick={() => navigate(`/productinfo/${id}`)}
                                            className="lg:h-80 h-96 w-full object-cover"
                                            src={previewImageUrl}
                                            alt={title}
                                        />
                                        <div className="p-6">
                                            <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                                                {subject} - {grade}
                                            </h2>
                                            <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                                                {title?.substring(0, 40)}
                                            </h1>
                                            <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                                                ₹{price}
                                            </h1>

                                            <div className="flex justify-center">
                                                {cartItems.some((p) => p.id === item.id) ? (
                                                    <button
                                                        onClick={() => deleteCart(item)}
                                                        className="bg-red-700 hover:bg-pink-600 w-full text-white py-[4px] rounded-lg font-bold"
                                                    >
                                                        Remove From Cart
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => addCart(item)}
                                                        className="bg-pink-500 hover:bg-pink-600 w-full text-white py-[4px] rounded-lg font-bold"
                                                    >
                                                        Add To Cart
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePageProductCard;
