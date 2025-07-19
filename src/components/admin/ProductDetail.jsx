import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import Loader from "../loader/Loader";
import { deleteDoc, doc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import toast from "react-hot-toast";

const ProductDetail = () => {
    const context = useContext(myContext);
    const { loading, setLoading, getAllProduct, getAllProductFunction } = context;
    const navigate = useNavigate();

    const deleteProduct = async (id) => {
        setLoading(true);
        try {
            await deleteDoc(doc(fireDB, 'notes', id));
            toast.success('Product Deleted successfully');
            getAllProductFunction();
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="py-5 flex justify-between items-center">
                <h1 className="text-xl text-pink-300 font-bold">All notes</h1>
                <Link to="/addproduct">
                    <button className="px-5 py-2 bg-pink-50 border border-pink-100 rounded-lg">
                        Add Product
                    </button>
                </Link>
            </div>

            {loading && (
                <div className="flex justify-center relative top-20">
                    <Loader />
                </div>
            )}

            <div className="w-full overflow-x-auto mb-5">
                <table className="w-full text-left border border-collapse sm:border-separate border-pink-100 text-pink-400">
                    <thead>
                        <tr>
                            <th className="h-12 px-6 text-md border-pink-100 text-slate-700 bg-slate-100 font-bold">S.No.</th>
                            <th className="h-12 px-6 text-md border-pink-100 text-slate-700 bg-slate-100 font-bold">Image</th>
                            <th className="h-12 px-6 text-md border-pink-100 text-slate-700 bg-slate-100 font-bold">Title</th>
                            <th className="h-12 px-6 text-md border-pink-100 text-slate-700 bg-slate-100 font-bold">Price</th>
                            <th className="h-12 px-6 text-md border-pink-100 text-slate-700 bg-slate-100 font-bold">Category</th>
                            <th className="h-12 px-6 text-md border-pink-100 text-slate-700 bg-slate-100 font-bold">Date</th>
                            <th className="h-12 px-6 text-md border-pink-100 text-slate-700 bg-slate-100 font-bold">Action</th>
                            <th className="h-12 px-6 text-md border-pink-100 text-slate-700 bg-slate-100 font-bold">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(getAllProduct) && getAllProduct.length > 0 ? (
                            getAllProduct.map((item, index) => {
                                const { id, title, price, category, date, productImageUrl } = item;
                                return (
                                    <tr key={id} className="text-pink-300">
                                        <td className="h-12 px-6 text-md border-t border-pink-100 text-slate-500">
                                            {index + 1}.
                                        </td>
                                        <td className="h-12 px-6 text-md border-t border-pink-100 text-slate-500">
                                            <div className="flex justify-center">
                                                <img className="w-20" src={productImageUrl} alt={title} />
                                            </div>
                                        </td>
                                        <td className="h-12 px-6 text-md border-t border-pink-100 text-slate-500">
                                            {title}
                                        </td>
                                        <td className="h-12 px-6 text-md border-t border-pink-100 text-slate-500">
                                            ₹{price}
                                        </td>
                                        <td className="h-12 px-6 text-md border-t border-pink-100 text-slate-500">
                                            {category}
                                        </td>
                                        <td className="h-12 px-6 text-md border-t border-pink-100 text-slate-500">
                                            {date}
                                        </td>
                                        <td
                                            onClick={() => navigate(`/updateproduct/${id}`)}
                                            className="h-12 px-6 text-md border-t border-pink-100 text-green-500 cursor-pointer"
                                        >
                                            Edit
                                        </td>
                                        <td
                                            onClick={() => deleteProduct(id)}
                                            className="h-12 px-6 text-md border-t border-pink-100 text-red-500 cursor-pointer"
                                        >
                                            Delete
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center text-slate-400 py-4">
                                    No notes found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductDetail;
