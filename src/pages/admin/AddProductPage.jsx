import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { fireDB } from "../../firebase/FirebaseConfig";
import myContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";

const subjectList = ['Chemistry', 'Physics', 'Mathematics', 'Biology'];
const gradeList = ['Class 10', 'Class 11', 'Class 12', 'JEE', 'NEET'];

const AddProductPage = () => {
    const { loading, setLoading } = useContext(myContext);
    const navigate = useNavigate();

    const [note, setNote] = useState({
        title: "",
        price: 0,
        productImageUrl: "",
        description: "",
        notesPDFUrl: "",
        youtubeURLs: [],
        subject: "",
        grade: "",
        keywords: [],
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", { 
            month: "short", 
            day: "2-digit", 
            year: "numeric" 
        })
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNote({ 
            ...note, 
            [name]: name === 'price' ? Number(value) : value 
        });
    };

    const addNoteFunction = async () => {
        // Validation
        const requiredFields = ['title', 'price', 'productImageUrl', 'subject', 'grade', 'description'];
        const missingFields = requiredFields.filter(field => !note[field]?.toString().trim());
        
        if (missingFields.length > 0) {
            return toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        setLoading(true);
        try {
            console.log("Adding note:", note);
            const notesRef = collection(fireDB, 'notes');
            await addDoc(notesRef, {
                ...note,
                keywords: note.keyodies.length > 0 ? note.keywords : [note.subject.toLowerCase(), note.grade.toLowerCase()]
            });
            toast.success("Note added successfully!");
            navigate('/admin-dashboard');
        } catch (error) {
            console.error("Firestore error:", error);
            toast.error(`Failed to add note: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex justify-center items-center min-h-screen px-4'>
            {loading && <Loader />}
            <div className="w-full max-w-md bg-pink-50 px-8 py-6 border border-pink-100 rounded-xl shadow-md">
                <h2 className='text-center text-2xl font-bold text-pink-500 mb-5'>Add New Note</h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        value={note.title}
                        onChange={handleInputChange}
                        placeholder='Note Title'
                        className='w-full bg-pink-50 border border-pink-200 px-3 py-2 rounded-md outline-none placeholder-pink-300 text-pink-300'
                        required
                    />
                    <input
                        type="number"
                        name="price"
                        value={note.price}
                        onChange={handleInputChange}
                        placeholder='Price'
                        className='w-full bg-pink-50 border border-pink-200 px-3 py-2 rounded-md outline-none placeholder-pink-300 text-pink-300'
                        required
                        min="0"
                    />
                    {/* Other input fields... */}
                    
                    <button
                        onClick={addNoteFunction}
                        disabled={loading}
                        className={`w-full py-2 font-bold rounded-md text-white ${loading ? 'bg-pink-300 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'}`}
                    >
                        {loading ? 'Adding Note...' : 'Add Note'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProductPage;