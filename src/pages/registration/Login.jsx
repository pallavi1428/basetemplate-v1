import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, fireDB } from "../../firebase/FirebaseConfig";
import Loader from "../../components/loader/Loader";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  /* ------------------------------------------------------------------ */
  /* Local loading state (keeps context.loading free for other screens)  */
  /* ------------------------------------------------------------------ */
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();

  const [userLogin, setUserLogin] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) =>
    setUserLogin((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validateForm = () => {
    const { email, password } = userLogin;
    if (!email || !password) return toast.error("All fields are required");
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Invalid email");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setAuthLoading(true);
    try {
      /* ---------------- Firebase Auth ---------------- */
      const { user } = await signInWithEmailAndPassword(
        auth,
        userLogin.email,
        userLogin.password
      );

      /* -------- Get profile once from Firestore ------- */
      const snap = await getDoc(doc(fireDB, "users", user.uid));
      if (!snap.exists()) throw new Error("User data not found");

      const userData = snap.data();
      localStorage.setItem("users", JSON.stringify(userData));
      toast.success("Login Successful");

      navigate(
        userData.role === "admin" ? "/admin-dashboard" : "/user-dashboard"
      );
    } catch (err) {
      console.error(err);
      toast.error(
        err.code?.replace("auth/", "").replaceAll("-", " ") || err.message
      );
    } finally {
      setAuthLoading(false);
      setUserLogin({ email: "", password: "" });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {authLoading && <Loader />}
      <form
        onSubmit={handleSubmit}
        className="login_Form bg-pink-50 px-8 py-6 border border-pink-100 rounded-xl shadow-md w-96"
      >
        <div className="mb-5">
          <h2 className="text-center text-2xl font-bold text-pink-500">
            Login
          </h2>
        </div>

        <div className="mb-3">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={userLogin.email}
            onChange={handleInputChange}
            className="bg-pink-50 border border-pink-200 px-2 py-2 w-full rounded-md outline-none placeholder-pink-200"
          />
        </div>

        <div className="mb-5 relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={userLogin.password}
            onChange={handleInputChange}
            className="bg-pink-50 border border-pink-200 px-2 py-2 w-full rounded-md outline-none placeholder-pink-200"
          />
          <span
            className="absolute right-3 top-2 text-sm cursor-pointer text-pink-500"
            onClick={() => setShowPassword((prev) => !prev)}
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
            {authLoading ? "Logging in..." : "Login"}
          </button>
        </div>

        <div>
          <h2 className="text-black">
            Don't have an account?{" "}
            <Link to="/signup" className="text-pink-500 font-bold">
              Signup
            </Link>
          </h2>
        </div>
      </form>
    </div>
  );
};

export default Login;
