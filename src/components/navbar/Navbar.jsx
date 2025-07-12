import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../searchBar/SearchBar";
import { useSelector } from "react-redux";

const Navbar = () => {
    const user = JSON.parse(localStorage.getItem('users'));
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cart);

    const logout = () => {
        localStorage.removeItem('users'); // Corrected
        navigate("/login");
    };

    return (
        <nav className="bg-orange-600 sticky top-0">
            <div className="lg:flex lg:justify-between items-center py-3 lg:px-3">
                {/* Left */}
                <div className="left py-3 lg:py-0">
                    <Link to="/">
                        <h2 className="font-bold text-white text-2xl text-center">Handly</h2>
                    </Link>
                </div>

                {/* Right */}
                <div className="right flex justify-center mb-4 lg:mb-0">
                    <ul className="flex space-x-3 text-white font-medium text-md px-5">
                        <li>
                            <Link to="/">Uplaod Notes</Link>
                        </li>

                        <li>
                            <Link to="/allproduct">Browse Notes</Link>
                        </li>

                        {!user && (
                            <>
                                <li>
                                    <Link to="/signup">Signup</Link>
                                </li>
                                <li>
                                    <Link to="/login">Login</Link>
                                </li>
                            </>
                        )}

                        {user?.role === "user" && (
                            <li>
                                <Link to="/user-dashboard">User</Link>
                            </li>
                        )}

                        {user?.role === "admin" && (
                            <li>
                                <Link to="/admin-dashboard">Admin</Link>
                            </li>
                        )}

                        {user && (
                            <li className="cursor-pointer" onClick={logout}>
                                Logout
                            </li>
                        )}

                        <li>
                            <Link to="/cart">Cart({cartItems.length})</Link>
                        </li>
                    </ul>
                </div>

                {/* Search Bar */}
                <SearchBar />
            </div>
        </nav>
    );
};

export default Navbar;
