import { useNavigate, useParams } from "react-router";
import Layout from "../../components/layout/Layout";
import { useContext, useEffect } from "react";
import myContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";
import toast from "react-hot-toast";

const CategoryPage = () => {
    const { categoryname } = useParams();
    const context = useContext(myContext);
    const { getAllProduct, loading } = context;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);

    // Define our new categories
    const categories = {
        youtube: "YouTube Notes",
        courses: "Course Notes",
        regular: "Regular Notes"
    };

    // Filter products based on our new categories
    const filterProduct = () => {
        switch(categoryname) {
            case 'youtube':
                return getAllProduct.filter(obj => obj.youtubeUrl);
            case 'courses':
                return getAllProduct.filter(obj => obj.courseUrl);
            case 'regular':
                return getAllProduct.filter(obj => !obj.youtubeUrl && !obj.courseUrl);
            default:
                // Fallback to original category system if needed
                return getAllProduct.filter(obj => obj.category.includes(categoryname));
        }
    };

    const products = filterProduct();

    // Get top YouTube channels for the sidebar
    const getTopChannels = () => {
        const youtubeProducts = getAllProduct.filter(obj => obj.youtubeUrl);
        const channelMap = {};
        
        youtubeProducts.forEach(product => {
            if (product.youtubeChannelId) {
                if (!channelMap[product.youtubeChannelId]) {
                    channelMap[product.youtubeChannelId] = {
                        channelId: product.youtubeChannelId,
                        channelName: product.youtubeChannelName,
                        channelImage: product.youtubeChannelImage,
                        noteCount: 0
                    };
                }
                channelMap[product.youtubeChannelId].noteCount++;
            }
        });
        
        return Object.values(channelMap)
            .sort((a, b) => b.noteCount - a.noteCount)
            .slice(0, 5);
    };

    const topChannels = categoryname === 'youtube' ? getTopChannels() : [];

    const addCart = (item) => {
        dispatch(addToCart(item));
        toast.success("Add to cart");
    };

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Delete cart");
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <Layout>
            <div className="mt-10">
                {/* Updated heading with proper category names */}
                <div className="text-center mb-5">
                    <h1 className="text-2xl font-semibold">
                        {categories[categoryname] || `${categoryname} Notes`}
                    </h1>
                    
                    {/* Show top channels only for YouTube category */}
                    {categoryname === 'youtube' && topChannels.length > 0 && (
                        <div className="flex justify-center mt-3 space-x-4">
                            {topChannels.map(channel => (
                                <div key={channel.channelId} className="flex flex-col items-center">
                                    <img 
                                        src={channel.channelImage} 
                                        alt={channel.channelName}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <span className="text-xs mt-1">{channel.channelName}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Main content */}
                {loading ? (
                    <div className="flex justify-center">
                        <Loader />
                    </div>
                ) : (
                    <section className="text-gray-600 body-font">
                        <div className="container px-5 py-5 mx-auto">
                            <div className="flex flex-wrap -m-4 justify-center">
                                {products.length > 0 ? (
                                    products.map((item, index) => {
                                        const { id, title, price, productImageUrl, youtubeUrl, courseUrl } = item;
                                        return (
                                            <div key={index} className="p-4 w-full md:w-1/4">
                                                <div className="h-full border border-gray-300 rounded-xl overflow-hidden shadow-md cursor-pointer">
                                                    <img
                                                        onClick={() => navigate(`/productinfo/${id}`)}
                                                        className="lg:h-80 h-96 w-full"
                                                        src={productImageUrl}
                                                        alt="blog"
                                                    />
                                                    <div className="p-6">
                                                        {/* Badge showing note type */}
                                                        <div className="mb-2">
                                                            {youtubeUrl && (
                                                                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                                    YouTube
                                                                </span>
                                                            )}
                                                            {courseUrl && (
                                                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                                    Course
                                                                </span>
                                                            )}
                                                            {!youtubeUrl && !courseUrl && (
                                                                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                                    Regular
                                                                </span>
                                                            )}
                                                        </div>
                                                        
                                                        <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                                                            {title.substring(0, 25)}
                                                        </h1>
                                                        <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                                                            ₹{price}
                                                        </h1>

                                                        <div className="flex justify-center">
                                                            {cartItems.some(p => p.id === item.id) ? (
                                                                <button
                                                                    onClick={() => deleteCart(item)}
                                                                    className="bg-red-700 hover:bg-pink-600 w-full text-white py-[4px] rounded-lg font-bold"
                                                                >
                                                                    Delete To Cart
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
                                    })
                                ) : (
                                    <div>
                                        <div className="flex justify-center">
                                            <img className="mb-2" src="https://cdn-icons-png.flaticon.com/128/2748/2748614.png" alt="" />
                                        </div>
                                        <h1 className="text-black text-xl">
                                            No {categories[categoryname] || categoryname} notes found
                                        </h1>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </Layout>
    );
};

export default CategoryPage;