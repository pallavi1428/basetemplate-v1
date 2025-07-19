import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fireDB } from "../../firebase/FirebaseConfig";
import myContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";

const categoryList = [
  'YouTube Notes',
  'Course Notes',
  'Non-YouTube Notes'
];

const AddProductPage = () => {
  const { loading, setLoading } = useContext(myContext);
  const navigate = useNavigate();

  const [note, setNote] = useState({
    title: "",
    price: "",
    productImageUrl: "",
    category: "YouTube Notes", // Default to YouTube Notes
    description: "",
    youtubeUrl: "",
    courseUrl: "",
    subject: "",
    semester: "",
    examType: "",
    collegeName: "",
    time: Timestamp.now(),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNote({ ...note, [name]: value });
  };

  const addNoteFunction = async () => {
    const user = JSON.parse(localStorage.getItem('users'));
    if (!user) {
      toast.error("Please login again");
      navigate('/login');
      return;
    }

    // Basic validation
    const { title, description, category } = note;
    if (!title || !description || !category) {
      toast.error("Title, description & category are required");
      return;
    }

    // Category-specific validation
    if (category === 'YouTube Notes' && !note.youtubeUrl) {
      toast.error("YouTube URL is required for YouTube Notes");
      return;
    }

    if (category === 'Course Notes' && !note.courseUrl) {
      toast.error("Course URL is required for Course Notes");
      return;
    }

    if (category === 'Non-YouTube Notes') {
      if (!note.subject) {
        toast.error("Subject is required for Non-YouTube Notes");
        return;
      }
    }

    setLoading(true);
    try {
      const notesRef = collection(fireDB, 'notes');
      await addDoc(notesRef, {
        ...note,
        price: Number(note.price),
        youtubeUrl: note.youtubeUrl.trim(),
        courseUrl: note.courseUrl.trim(),
        uploaderId: user.uid,
        uploaderName: user.name || "Anonymous",
        status: "active",
        createdAt: Timestamp.now()
      });
      toast.success("Note added successfully ✅");
      navigate('/user-dashboard', { state: { activeTab: 'myNotes' } });
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen px-4'>
      {loading && <Loader />}
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h2 className='text-2xl font-bold mb-5 text-center'>Add Note</h2>

        <input 
          name="title" 
          value={note.title} 
          onChange={handleInputChange} 
          placeholder="Title*" 
          className="w-full mb-3 p-2 border rounded" 
        />
        
        <textarea 
          name="description" 
          value={note.description} 
          onChange={handleInputChange} 
          placeholder="Description*" 
          rows={4} 
          className="w-full mb-3 p-2 border rounded" 
        />
        
        <input 
          name="productImageUrl" 
          value={note.productImageUrl} 
          onChange={handleInputChange} 
          placeholder="Image URL" 
          className="w-full mb-3 p-2 border rounded" 
        />
        
        <input 
          name="price" 
          value={note.price} 
          onChange={handleInputChange} 
          placeholder="Price" 
          type="number" 
          className="w-full mb-3 p-2 border rounded" 
        />

        <select 
          name="category" 
          value={note.category} 
          onChange={handleInputChange} 
          className="w-full mb-3 p-2 border rounded"
        >
          {categoryList.map((c,i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        {/* YouTube URL Field (shown only for YouTube Notes) */}
        {note.category === 'YouTube Notes' && (
          <input 
            name="youtubeUrl" 
            value={note.youtubeUrl} 
            onChange={handleInputChange} 
            placeholder="YouTube URL*" 
            className="w-full mb-3 p-2 border rounded" 
          />
        )}

        {/* Course URL Field (shown only for Course Notes) */}
        {note.category === 'Course Notes' && (
          <input 
            name="courseUrl" 
            value={note.courseUrl} 
            onChange={handleInputChange} 
            placeholder="Course URL*" 
            className="w-full mb-3 p-2 border rounded" 
          />
        )}

        {/* Additional Fields for Non-YouTube Notes */}
        {note.category === 'Non-YouTube Notes' && (
          <>
            <input 
              name="subject" 
              value={note.subject} 
              onChange={handleInputChange} 
              placeholder="Subject*" 
              className="w-full mb-3 p-2 border rounded" 
            />
            <input 
              name="semester" 
              value={note.semester} 
              onChange={handleInputChange} 
              placeholder="Semester (optional)" 
              className="w-full mb-3 p-2 border rounded" 
            />
            <input 
              name="examType" 
              value={note.examType} 
              onChange={handleInputChange} 
              placeholder="Competitive Exam (optional)" 
              className="w-full mb-3 p-2 border rounded" 
            />
            <input 
              name="collegeName" 
              value={note.collegeName} 
              onChange={handleInputChange} 
              placeholder="College Name (optional)" 
              className="w-full mb-3 p-2 border rounded" 
            />
          </>
        )}

        <button
          onClick={addNoteFunction}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default AddProductPage;