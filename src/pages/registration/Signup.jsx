import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { auth, fireDB } from "../../firebase/FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";

const Signup = () => {
    const { loading, setLoading } = useContext(myContext);
    const navigate = useNavigate();

    const [userSignup, setUserSignup] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserSignup(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const { name, email, password } = userSignup;
        if (!name || !email || !password) {
            toast.error("All fields are required");
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            toast.error("Please enter a valid email");
            return false;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const users = await createUserWithEmailAndPassword(
                auth,
                userSignup.email,
                userSignup.password
            );

            const user = {
                name: userSignup.name,
                email: users.user.email,
                uid: users.user.uid,
                role: userSignup.role,
                time: Timestamp.now(),
                date: new Date().toLocaleString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                })
            };

            await addDoc(collection(fireDB, "user"), user);

            setUserSignup({
                name: "",
                email: "",
                password: ""
            });

            toast.success("Signup successful");
            navigate('/login');
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex justify-center items-center h-screen'>
            {loading && <Loader />}
            <form onSubmit={handleSubmit} className="login_Form bg-pink-50 px-8 py-6 border border-pink-100 rounded-xl shadow-md w-96">

                <div className="mb-5">
                    <h2 className='text-center text-2xl font-bold text-pink-500'>
                        Signup
                    </h2>
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        name="name"
                        placeholder='Full Name'
                        value={userSignup.name}
                        onChange={handleInputChange}
                        className='bg-pink-50 border border-pink-200 px-2 py-2 w-full rounded-md outline-none placeholder-pink-200'
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="email"
                        name="email"
                        placeholder='Email Address'
                        value={userSignup.email}
                        onChange={handleInputChange}
                        className='bg-pink-50 border border-pink-200 px-2 py-2 w-full rounded-md outline-none placeholder-pink-200'
                    />
                </div>

                <div className="mb-5 relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder='Password'
                        value={userSignup.password}
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
                        {loading ? 'Signing up...' : 'Signup'}
                    </button>
                </div>

                <div>
                    <h2 className='text-black'>
                        Have an account? <Link to='/login' className='text-pink-500 font-bold'>Login</Link>
                    </h2>
                </div>
            </form>
        </div>
    );
};

export default Signup;
