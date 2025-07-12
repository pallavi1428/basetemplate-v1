import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Timestamp, setDoc, doc } from "firebase/firestore";
import { auth, fireDB } from "../../firebase/FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";

const Signup = () => {
  /* local spinner */
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();

  const [userSignup, setUserSignup] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) =>
    setUserSignup((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validateForm = () => {
    const { name, email, password } = userSignup;
    if (!name || !email || !password) return toast.error("All fields required");
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Invalid email");
    if (password.length < 6) return toast.error("Min 6‑char password");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setAuthLoading(true);
    try {
      /* ---------- Firebase Auth ---------- */
      const { user } = await createUserWithEmailAndPassword(
        auth,
        userSignup.email,
        userSignup.password
      );

      /* ---------- Create profile doc ---------- */
      const profile = {
        uid: user.uid,
        name: userSignup.name,
        email: user.email,
        role: userSignup.role, // 'user' or 'admin'
        createdAt: Timestamp.now(),
      };

      await setDoc(doc(fireDB, "users", user.uid), profile);

      toast.success("Signup successful — please log in");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err.code?.replace("auth/", "").replaceAll("-", " ") || err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {authLoading && <Loader />}
      <form
        onSubmit={handleSubmit}
        className="login_Form bg-pink-50 px-8 py-6 border border-pink-100 rounded-xl shadow-md w-96"
      >
        {/* ---- identical JSX aside from state names ---- */}
        <div className="mb-5">
          <h2 className="text-center text-2xl font-bold text-pink-500">Signup</h2>
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={userSignup.name}
            onChange={handleInputChange}
            className="bg-pink-50 border border-pink-200 px-2 py-2 w-full rounded-md outline-none placeholder-pink-200"
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={userSignup.email}
            onChange={handleInputChange}
            className="bg-pink-50 border border-pink-200 px-2 py-2 w-full rounded-md outline-none placeholder-pink-200"
          />
        </div>
        <div className="mb-5 relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={userSignup.password}
            onChange={handleInputChange}
            className="bg-pink-50 border border-pink-200 px-2 py-2 w-full rounded-md outline-none placeholder-pink-200"
          />
          <span
            className="absolute right-3 top-2 text-sm cursor-pointer text-pink-500"
            onClick={() => setShowPassword((p) => !p)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>
        <div className="mb-5">
          <button
            type="submit"
            className={`bg-pink-500 hover:bg-pink-600 w-full text-white py-2 font-bold rounded-md transition-colors ${
              authLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={authLoading}
          >
            {authLoading ? "Signing up..." : "Signup"}
          </button>
        </div>
        <div>
          <h2 className="text-black">
            Have an account?{" "}
            <Link to="/login" className="text-pink-500 font-bold">
              Login
            </Link>
          </h2>
        </div>
      </form>
    </div>
  );
};

export default Signup;
