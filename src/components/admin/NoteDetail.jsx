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
            <p className="text-sm text-gray-500">Branch: {note.branch}</p>
            <p className="text-sm text-gray-500">Year: {note.year}</p>
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
        </div>
    );
};

export default NoteDetail;
