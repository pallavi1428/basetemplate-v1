import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../searchBar/SearchBar";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";

const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cart);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("users"));
        setUser(storedUser);
    }, []);

    const logout = () => {
        localStorage.removeItem("users");
        setUser(null);
        navigate("/login");
    };

    return (
        <nav className="bg-orange-600 sticky top-0 z-50">
            <div className="lg:flex lg:justify-between items-center py-3 lg:px-3">
                {/* Left: Brand */}
                <div className="left py-3 lg:py-0">
                    <Link to="/">
                        <h2 className="font-bold text-white text-2xl text-center">Handly</h2>
                    </Link>
                </div>

                {/* Right: Menu */}
                <div className="right flex justify-center mb-4 lg:mb-0">
                    <ul className="flex space-x-4 text-white font-medium text-md px-5 items-center">
                        <li>
                            <span
                                onClick={() => {
                                    if (user) {
                                        navigate("/addproduct");
                                    } else {
                                        navigate("/login");
                                    }
                                }}
                                className="cursor-pointer"
                            >
                                Upload Notes
                            </span>
                        </li>



                        <li>
                            <Link to="/allproduct">Browse Notes</Link>
                        </li>

                        <li>
                            {user ? (
                                <Link to={user.role === "admin" ? "/admin-dashboard" : "/user-dashboard"} className="flex items-center space-x-1">
                                    <FaUserCircle size={24} />
                                    <span className="text-sm hidden sm:inline">Dashboard</span>
                                </Link>
                            ) : (
                                <Link to="/login" className="flex items-center space-x-1">
                                    <FaUserCircle size={24} />
                                    <span className="text-sm hidden sm:inline">Login</span>
                                </Link>
                            )}
                        </li>

                        {/* {user && (
                            <li>
                                <button onClick={logout} className="text-sm text-white underline">
                                    Logout
                                </button>
                            </li>
                        )} */}


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
