import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      login(res.data);
      toast.success("LoggedIn Successfully");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden p-4">
      {/* Animated glowing orbs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-600 rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute top-40 -right-20 w-80 h-80 bg-pink-600 rounded-full filter blur-3xl opacity-40 animate-ping"></div>
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl opacity-30 animate-bounce"></div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900/60 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-gray-700"
        >
          <h2 className="text-3xl font-extrabold text-center text-white mb-8 tracking-wide">
            Login to <span className="text-purple-400">ConvoAI</span>
          </h2>

          <div className="space-y-5">
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800/60 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
            />
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800/60 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-[1.03] transition-all"
          >
            Login
          </button>

          <p className="mt-6 text-center text-sm text-gray-400">
            Not registered?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-400 font-semibold cursor-pointer hover:underline"
            >
              Create an account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
