// src/components/admin/NoteDetail.jsx
const NoteDetail = ({ note }) => {
    return (
        <div className="bg-white p-4 rounded shadow-md">
            <img
                src={note.productImageUrl}
                alt={note.title}
                className="w-full h-48 object-cover mb-4 rounded"
            />
            <h2 className="text-xl font-bold mb-1">{note.title}</h2>
            <p className="text-gray-600 text-sm mb-2">{note.description}</p>

            {note.subject && (
                <p className="text-sm text-gray-500">Subject: {note.subject}</p>
            )}
            {note.grade && (
                <p className="text-sm text-gray-500">Grade: {note.grade}</p>
            )}
            {note.category && (
                <p className="text-sm text-gray-500">Category: {note.category}</p>
            )}

            <p className="text-sm text-gray-500">Price: ₹{note.price}</p>

            {note.notesPDFUrl && (
                <a
                    href={note.notesPDFUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 underline mt-2 inline-block"
                >
                    View Notes PDF
                </a>
            )}

            {note.youtubeURLs?.length > 0 && (
                <div className="mt-2">
                    <p className="font-semibold">YouTube Links:</p>
                    {note.youtubeURLs.map((url, i) => (
                        <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 block underline text-sm"
                        >
                            Video {i + 1}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NoteDetail;
