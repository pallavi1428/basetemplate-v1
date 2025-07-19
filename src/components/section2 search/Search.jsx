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

            navigate("/search", { state: { results: notes, url: youtubeUrl } });
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };

    return (
        <div className="bg-orange-50 py-12 px-4 shadow-inner border-t border-orange-200">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-orange-800 mb-6">
                    🎯 Instantly Find Notes with YouTube URL
                </h2>
                <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="Paste YouTube URL here..."
                    className="w-full px-4 py-3 rounded-md border-2 border-orange-300 focus:outline-none focus:border-orange-500 mb-4 text-lg"
                />
                <button
                    onClick={handleSearch}
                    className="bg-orange-600 text-white px-6 py-3 rounded-md text-lg font-semibold shadow hover:bg-orange-700 transition"
                >
                    🔍 Search Notes
                </button>
            </div>
        </div>
    );
};

export default Search;
