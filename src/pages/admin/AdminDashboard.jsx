// src/pages/admin/AdminDashboard.jsx

import React, { useEffect, useState, useContext } from "react";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import myContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    const { loading, setLoading } = useContext(myContext);
    const [notes, setNotes] = useState([]);
    const user = JSON.parse(localStorage.getItem('users')) || {};

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const notesRef = collection(fireDB, "notes");
            const snapshot = await getDocs(notesRef);
            const notesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNotes(notesData);
        } catch (error) {
            console.error("Error fetching notes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <div className="px-5 mt-5 space-y-5 min-h-screen">
            {loading ? (
                <Loader />
            ) : (
                <>
                    {/* Header */}
                    <div className="bg-pink-50 py-5 border border-pink-100 rounded-lg">
                        <h1 className="text-center text-2xl font-bold text-pink-500">Admin Dashboard</h1>
                    </div>

                    <div className="flex justify-end">
                        <Link
                            to="/addproduct"
                            className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-all duration-200"
                        >
                            Add Product
                        </Link>
                    </div>

                    {/* Admin Info */}
                    <div className="bg-pink-50 py-5 rounded-xl border border-pink-100">
                        <div className="flex justify-center">
                            <img
                                src="https://cdn-icons-png.flaticon.com/128/2202/2202112.png"
                                alt="Admin avatar"
                                className="h-20 w-20 rounded-full border border-gray-200 object-cover"
                                onError={(e) => e.target.src = 'https://via.placeholder.com/80'}
                            />
                        </div>
                        <div className="space-y-2 mt-4 text-center">
                            <h1 className="text-lg"><span className="font-bold">Name: </span>{user.name || "N/A"}</h1>
                            <h1 className="text-lg"><span className="font-bold">Email: </span>{user.email || "N/A"}</h1>
                            <h1 className="text-lg"><span className="font-bold">Date: </span>{user.date || "N/A"}</h1>
                            <h1 className="text-lg"><span className="font-bold">Role: </span>{user.role || "N/A"}</h1>
                        </div>
                    </div>

                    {/* Notes Table */}
                    <div className="overflow-x-auto border rounded-lg bg-white">
                        <table className="min-w-full text-sm text-gray-600">
                            <thead className="bg-pink-100 text-pink-600">
                                <tr>
                                    <th className="px-4 py-2 text-left">#</th>
                                    <th className="px-4 py-2 text-left">Title</th>
                                    <th className="px-4 py-2 text-left">Category</th>
                                    <th className="px-4 py-2 text-left">Price</th>
                                    <th className="px-4 py-2 text-left">Users Added to Cart</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notes.map((note, index) => (
                                    <tr key={note.id} className="border-b hover:bg-pink-50">
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">{note.title || "Untitled"}</td>
                                    <td className="px-4 py-2">{note.category || "N/A"}</td>
                                    <td className="px-4 py-2">₹{note.price || 0}</td>
                                    <td className="px-4 py-2">
                                        {note.addedBy && note.addedBy.length > 0
                                        ? note.addedBy.join(", ")
                                        : "Not Tracked"}
                                    </td>
                                    <td className="px-4 py-2">
                                        <Link
                                        to={`/updateproduct/${note.id}`}
                                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
                                        >
                                        Update
                                        </Link>
                                    </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
