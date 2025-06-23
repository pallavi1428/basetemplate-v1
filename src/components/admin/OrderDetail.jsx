import { useContext } from "react";
import myContext from "../../context/myContext";

const UserDetail = () => {
    const context = useContext(myContext);
    const { getAllUser } = context;

    return (
        <div>
            <div className="py-5">
                <h1 className="text-xl text-pink-300 font-bold">All Users</h1>
            </div>

            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border border-collapse sm:border-separate border-pink-100 text-pink-400">
                    <thead>
                        <tr>
                            {["S.No.", "Name", "Email", "UID", "Role", "Date"].map((header, idx) => (
                                <th key={idx} className="h-12 px-6 text-md border-pink-100 text-slate-700 bg-slate-100 font-bold">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {getAllUser.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            getAllUser.map((user, index) => (
                                <tr key={user.uid} className="text-pink-300">
                                    <td className="h-12 px-6 text-md border-t border-pink-100 text-slate-500">
                                        {index + 1}
                                    </td>
                                    <td className="h-12 px-6 text-md border-t border-pink-100 text-slate-500 capitalize">
                                        {user.name}
                                    </td>
                                    <td className="h-12 px-6 text-md border-t border-pink-100 text-slate-500">
                                        {user.email}
                                    </td>
                                    <td className="h-12 px-6 text-md border-t border-pink-100 text-slate-500">
                                        {user.uid}
                                    </td>
                                    <td className="h-12 px-6 text-md border-t border-pink-100 text-slate-500">
                                        {user.role}
                                    </td>
                                    <td className="h-12 px-6 text-md border-t border-pink-100 text-slate-500">
                                        {new Date(user.date).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserDetail;
