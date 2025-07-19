import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fireDB } from "../../firebase/FirebaseConfig";
import myContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";

const categoryList = [
  'chemistry','physics','maths','notescategory' // update based on your notes
];

const AddProductPage = () => {
  const { loading, setLoading } = useContext(myContext);
  const navigate = useNavigate();

  const [note, setNote] = useState({
    title: "", price: "", productImageUrl: "",
    category: "", description: "", youtubeURLs: [],
    time: Timestamp.now(),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNote({ ...note, [name]: value });
  };

const addNoteFunction = async () => {
  const { title, description, category } = note;
  if (!title || !description || !category) {
    toast.error("Title, description & category are required");
    return;
  }

  setLoading(true);
  try {
    const notesRef = collection(fireDB, 'notes'); // change 'notes' to your actual collection if needed
    await addDoc(notesRef, {
      ...note,
      price: Number(note.price),
      youtubeURLs: note.youtubeURLs.split(',').map(u => u.trim()),
    });
    toast.success("Note added successfully ✅");
    navigate('/admin-dashboard');
  } catch (error) {
    console.error("🔥 Firestore Add Error:", error);
    toast.error(`Error: ${error.message}`);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className='flex justify-center items-center min-h-screen px-4'>
      {loading && <Loader />}
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h2 className='text-2xl font-bold mb-5 text-center'>Add Note / Product</h2>

        <input name="title" value={note.title} onChange={handleInputChange} placeholder="Title" className="w-full mb-3 p-2 border rounded" />
        <textarea name="description" value={note.description} onChange={handleInputChange} placeholder="Description" rows={4} className="w-full mb-3 p-2 border rounded" />
        <input name="productImageUrl" value={note.productImageUrl} onChange={handleInputChange} placeholder="Image URL" className="w-full mb-3 p-2 border rounded" />
        <input name="price" value={note.price} onChange={handleInputChange} placeholder="Price" type="number" className="w-full mb-3 p-2 border rounded" />
        <input name="youtubeURLs" value={note.youtubeURLs} onChange={handleInputChange} placeholder="YouTube URLs (comma separated)" className="w-full mb-3 p-2 border rounded" />

        <select name="category" value={note.category} onChange={handleInputChange} className="w-full mb-3 p-2 border rounded">
          <option value="">Choose Category</option>
          {categoryList.map((c,i) => <option key={i} value={c}>{c}</option>)}
        </select>

        <button
            onClick={() => {
                console.log("🚀 Submit clicked");
                addNoteFunction();
            }}
            >
            Submit
        </button>

      </div>
    </div>
  );
}

export default AddProductPage;
