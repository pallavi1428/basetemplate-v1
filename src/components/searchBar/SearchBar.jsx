import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
    const [search, setSearch] = useState("");
    const [notesData, setNotesData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotes = async () => {
            const querySnapshot = await getDocs(collection(fireDB, "notes"));
            const notes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotesData(notes);
        };
        fetchNotes();
    }, []);

    const filteredNotes = notesData.filter((note) =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.keywords?.some(keyword => keyword.toLowerCase().includes(search.toLowerCase())) ||
        note.youtubeURLs?.some(url => url.includes(search))
    ).slice(0, 8);

    return (
        <div className="">
            <div className="input flex justify-center">
                <input
                    type="text"
                    placeholder="Search notes by title, keyword, or YouTube URL"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-gray-200 placeholder-gray-400 rounded-lg px-2 py-2 w-96 lg:w-96 md:w-96 outline-none text-black"
                />
            </div>

            {search && (
                <div className="flex justify-center">
                    <div className="block absolute bg-gray-200 w-96 md:w-96 lg:w-96 z-50 my-1 rounded-lg px-2 py-2">
                        {filteredNotes.length > 0 ? (
                            filteredNotes.map((note) => (
                                <div
                                    key={note.id}
                                    className="py-2 px-2 cursor-pointer"
                                    onClick={() => navigate(`/productinfo/${note.id}`)}
                                >
                                    <div className="flex items-center gap-2">
                                        <img
                                            className="w-10"
                                            src={note.productImageUrl}
                                            alt={note.title}
                                        />
                                        {note.title}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex justify-center">
                                <img
                                    className="w-20"
                                    src="https://cdn-icons-png.flaticon.com/128/10437/10437090.png"
                                    alt="No results"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
