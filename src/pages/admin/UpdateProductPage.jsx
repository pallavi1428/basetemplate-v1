import { useNavigate, useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";
import myContext from "../../context/myContext";

const categoryList = [
    'fashion', 'shirt', 'jacket', 'mobile', 'laptop', 'shoes', 'home', 'books'
];

const UpdateProductPage = () => {
    const { loading, setLoading, getAllProductFunction } = useContext(myContext);
    const navigate = useNavigate();
    const { id } = useParams();

    const [product, setProduct] = useState({
        title: "",
        price: "",
        productImageUrl: "",
        category: "",
        description: "",
        quantity: 1,
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    // Fetch Single Product
    const getSingleProductFunction = async () => {
        setLoading(true);
        try {
            const productTemp = await getDoc(doc(fireDB, "products", id));
            const data = productTemp.data();

            setProduct({
                title: data?.title || "",
                price: data?.price || "",
                productImageUrl: data?.productImageUrl || "",
                category: data?.category || "",
                description: data?.description || "",
                quantity: data?.quantity || 1,
                time: data?.time || Timestamp.now(),
                date: data?.date || new Date().toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to load product");
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async () => {
        if (
            product.title.trim() === "" ||
            product.price.trim() === "" ||
            product.productImageUrl.trim() === "" ||
            product.category.trim() === "" ||
            product.description.trim() === ""
        ) {
            return toast.error("All fields are required");
        }

        setLoading(true);
        try {
            await setDoc(doc(fireDB, 'products', id), product);
            toast.success("Product updated successfully");
            getAllProductFunction();
            navigate('/admin-dashboard');
        } catch (error) {
            console.error(error);
            toast.error("Failed to update product");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSingleProductFunction();
    }, []);

    return (
        <div className='flex justify-center items-center min-h-screen px-4'>
            {loading && <Loader />}
            <div className="w-full max-w-md bg-pink-50 px-8 py-6 border border-pink-100 rounded-xl shadow-md">
                <h2 className='text-center text-2xl font-bold text-pink-500 mb-5'>Update Product</h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        value={product.title}
                        onChange={handleInputChange}
                        placeholder='Product Title'
                        className='w-full bg-pink-50 border border-pink-200 px-3 py-2 rounded-md outline-none placeholder-pink-300 text-pink-300'
                    />
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleInputChange}
                        placeholder='Product Price'
                        className='w-full bg-pink-50 border border-pink-200 px-3 py-2 rounded-md outline-none placeholder-pink-300 text-pink-300'
                    />
                    <input
                        type="text"
                        name="productImageUrl"
                        value={product.productImageUrl}
                        onChange={handleInputChange}
                        placeholder='Product Image URL'
                        className='w-full bg-pink-50 border border-pink-200 px-3 py-2 rounded-md outline-none placeholder-pink-300 text-pink-300'
                    />

                    <select
                        name="category"
                        value={product.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-pink-50 border border-pink-200 rounded-md outline-none text-pink-300"
                    >
                        <option value="" disabled>Select Product Category</option>
                        {categoryList.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>

                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Product Description"
                        className="w-full px-3 py-2 bg-pink-50 border border-pink-200 rounded-md outline-none placeholder-pink-300 text-pink-300"
                    ></textarea>

                    <button
                        onClick={updateProduct}
                        disabled={loading}
                        className={`w-full py-2 font-bold rounded-md text-white ${loading ? 'bg-pink-300 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'}`}
                    >
                        {loading ? 'Updating Product...' : 'Update Product'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateProductPage;
