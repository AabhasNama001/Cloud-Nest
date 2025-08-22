import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

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
      navigate("/login");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl mb-6 text-center">Register</h2>
        <input
          className="w-full mb-4 p-2 border rounded"
          name="name"
          placeholder="Name"
          onChange={handleChange}
        />
        <input
          className="w-full mb-4 p-2 border rounded"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          className="w-full mb-4 p-2 border rounded"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button className="w-full bg-blue-500 text-white p-2 rounded">
          Register
        </button>
        <p className="mt-4 text-sm text-center">
          Already registered?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
