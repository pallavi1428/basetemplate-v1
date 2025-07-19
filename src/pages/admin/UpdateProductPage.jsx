import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";
import myContext from "../../context/myContext";

const categoryList = [
  "chemistry", "physics", "maths", "notescategory"
];

const UpdateProductPage = () => {
  const { loading, setLoading } = useContext(myContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState({
    title: "",
    price: "",
    productImageUrl: "",
    category: "",
    description: "",
    youtubeURLs: [],
    time: Timestamp.now(),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const getSingleProductFunction = async () => {
    setLoading(true);
    try {
      const docRef = doc(fireDB, "notes", id); // ✅ using "notes"
      const productSnap = await getDoc(docRef);
      const data = productSnap.data();
      setProduct({
        ...data,
        youtubeURLs: (data?.youtubeURLs || []).join(', '), // convert array to comma string
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load note");
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async () => {
    const { title, price, category, description, productImageUrl } = product;
    if (!title || !price || !category || !description || !productImageUrl) {
      return toast.error("All fields are required");
    }

    setLoading(true);
    try {
      await setDoc(doc(fireDB, "notes", id), {
        ...product,
        youtubeURLs: product.youtubeURLs.split(',').map((url) => url.trim()),
        price: Number(product.price),
        time: Timestamp.now(),
      });
      toast.success("Note updated successfully ✅");
      navigate("/admin-dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update note");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSingleProductFunction();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      {loading && <Loader />}
      <div className="w-full max-w-md bg-pink-50 px-8 py-6 border border-pink-100 rounded-xl shadow-md">
        <h2 className="text-center text-2xl font-bold text-pink-500 mb-5">
          Update Note / Product
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleInputChange}
            placeholder="Title"
            className="w-full px-3 py-2 border border-pink-200 rounded outline-none"
          />

          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            placeholder="Price"
            className="w-full px-3 py-2 border border-pink-200 rounded outline-none"
          />

          <input
            type="text"
            name="productImageUrl"
            value={product.productImageUrl}
            onChange={handleInputChange}
            placeholder="Image URL"
            className="w-full px-3 py-2 border border-pink-200 rounded outline-none"
          />

          <select
            name="category"
            value={product.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-pink-200 rounded outline-none"
          >
            <option value="">Choose Category</option>
            {categoryList.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>

          <textarea
            name="description"
            value={product.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Description"
            className="w-full px-3 py-2 border border-pink-200 rounded outline-none"
          ></textarea>

          <input
            type="text"
            name="youtubeURLs"
            value={product.youtubeURLs}
            onChange={handleInputChange}
            placeholder="YouTube URLs (comma separated)"
            className="w-full px-3 py-2 border border-pink-200 rounded outline-none"
          />

          <button
            onClick={updateProduct}
            disabled={loading}
            className={`w-full py-2 text-white font-bold rounded ${
              loading ? "bg-pink-300" : "bg-pink-500 hover:bg-pink-600"
            }`}
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProductPage;
