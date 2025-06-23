import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, fireDB } from "../../firebase/FirebaseConfig";
import Loader from "../../components/loader/Loader";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const Login = () => {
    const { loading, setLoading } = useContext(myContext);
    const navigate = useNavigate();

    const [userLogin, setUserLogin] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserLogin(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const { email, password } = userLogin;
        if (!email || !password) {
            toast.error("All fields are required");
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            toast.error("Please enter a valid email");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const users = await signInWithEmailAndPassword(auth, userLogin.email, userLogin.password);

            const q = query(
                collection(fireDB, "user"),
                where('uid', '==', users?.user?.uid)
            );

            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                let userData;
                QuerySnapshot.forEach((doc) => userData = doc.data());

                if (userData) {
                    localStorage.setItem("users", JSON.stringify(userData));
                    toast.success("Login Successful");

                    if (userData.role === "user") {
                        navigate('/user-dashboard');
                    } else {
                        navigate('/admin-dashboard');
                    }
                } else {
                    toast.error("User data not found");
                }

                setUserLogin({
                    email: "",
                    password: ""
                });
                setLoading(false);
            });

            return () => unsubscribe();
        } catch (error) {
            console.error(error);
            setLoading(false);
            toast.error(error.message || "Login Failed");
        }
    };

    return (
        <div className='flex justify-center items-center h-screen'>
            {loading && <Loader />}
            <form onSubmit={handleSubmit} className="login_Form bg-pink-50 px-8 py-6 border border-pink-100 rounded-xl shadow-md w-96">

                <div className="mb-5">
                    <h2 className='text-center text-2xl font-bold text-pink-500'>
                        Login
                    </h2>
                </div>

                <div className="mb-3">
                    <input
                        type="email"
                        name="email"
                        placeholder='Email Address'
                        value={userLogin.email}
                        onChange={handleInputChange}
                        className='bg-pink-50 border border-pink-200 px-2 py-2 w-full rounded-md outline-none placeholder-pink-200'
                    />
                </div>

                <div className="mb-5 relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder='Password'
                        value={userLogin.password}
                        onChange={handleInputChange}
                        className='bg-pink-50 border border-pink-200 px-2 py-2 w-full rounded-md outline-none placeholder-pink-200'
                    />
                    <span
                        className='absolute right-3 top-2 text-sm cursor-pointer text-pink-500'
                        onClick={() => setShowPassword(prev => !prev)}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </span>
                </div>

                <div className="mb-5">
                    <button
                        type="submit"
                        className={`bg-pink-500 hover:bg-pink-600 w-full text-white py-2 font-bold rounded-md transition-colors ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>

                <div>
                    <h2 className='text-black'>
                        Don't have an account? <Link to='/signup' className='text-pink-500 font-bold'>Signup</Link>
                    </h2>
                </div>
            </form>
        </div>
    );
};

export default Login;
