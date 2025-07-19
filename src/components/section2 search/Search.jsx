import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const navigate = useNavigate();

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

            // Navigate to /search and pass results as state
            navigate("/search", { state: { results: notes, url: youtubeUrl } });

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
        </div>
    );
};

export default Search;
