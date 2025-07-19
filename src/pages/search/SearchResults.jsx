import { useLocation } from "react-router-dom";

const SearchResults = () => {
    const location = useLocation();
    const results = location.state?.results || [];
    const url = location.state?.url || "";

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
                {results.length > 0 
                    ? `Found ${results.length} notes for: ${url}` 
                    : `No notes found for: ${url}`
                }
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
                {results.map((note) => (
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
        </div>
    );
};

export default SearchResults;
