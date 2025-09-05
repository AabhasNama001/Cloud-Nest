import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      login(res.data);
      toast.success("Registered Successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden p-4">
      {/* Animated glowing orbs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-600 rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute top-40 -right-20 w-80 h-80 bg-pink-600 rounded-full filter blur-3xl opacity-40 animate-spin"></div>
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl opacity-30 animate-bounce"></div>

      {/* Register Card */}
      <div className="w-full max-w-md relative z-10">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900/60 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-gray-700"
        >
          <h2 className="text-3xl font-extrabold text-center text-white mb-8 tracking-wide">
            Create <span className="text-pink-400">Account</span>
          </h2>

          <div className="space-y-5">
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800/60 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800/60 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              name="email"
              type="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
            />
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800/60 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-[1.03] transition-all"
          >
            Register
          </button>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already registered?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-400 font-semibold cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
