import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import { useState } from "react";

const Search = () => {
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [matchedNotes, setMatchedNotes] = useState([]);

    const handleSearch = async () => {
        if (!youtubeUrl) return;

        try {
            const querySnapshot = await getDocs(collection(fireDB, "notes"));
            const notes = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.youtubeURLs && data.youtubeURLs.includes(youtubeUrl)) {
                    notes.push({ id: doc.id, ...data });
                }
            });
            setMatchedNotes(notes);
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };

    return (
        <div className="bg-gray-100 py-10 px-4">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl font-semibold mb-4">Paste YouTube URL to Get Notes</h2>
                <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="Paste YouTube URL here..."
                    className="w-full px-4 py-2 rounded border border-gray-300 mb-4"
                />
                <button
                    onClick={handleSearch}
                    className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
                >
                    Search Notes
                </button>
            </div>

            {matchedNotes.length > 0 && (
                <div className="mt-10 max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
                    {matchedNotes.map((note) => (
                        <div key={note.id} className="bg-white p-4 rounded shadow">
                            <img src={note.productImageUrl} alt={note.title} className="w-full h-48 object-cover mb-2 rounded" />
                            <h3 className="text-lg font-bold">{note.title}</h3>
                            <p className="text-sm">{note.description}</p>
                            <p className="text-xs text-gray-500">{note.subject} | {note.grade}</p>
                            <a
                                href={note.notesPDFUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-600 underline mt-2 block"
                            >
                                View Notes
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;
