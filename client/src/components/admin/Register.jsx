import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const { axios, setToken, token } = useAppContext();
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/admin");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/v1/admin/register", {
        fullname,
        email,
        password,
      });

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = data.token;
        toast.success("Registration successful!");
        navigate("/admin"); // ✅ NOT /admin/dashboard
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full py-6 text-center">
            <h2 className="text-3xl font-bold">
              <span className="text-primary">Admin</span> Register
            </h2>
            <p className="font-light text-sm">Create an admin account</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 w-full sm:max-w-md text-gray-600">
            <div className="flex flex-col">
              <label htmlFor="fullname">Full Name</label>
              <input type="text" placeholder="Enter your full name" className="border-b-2 border-gray-300 p-2 outline-none mb-6" onChange={(e) => setFullname(e.target.value)} value={fullname} required />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <input type="email" placeholder="Enter your email" className="border-b-2 border-gray-300 p-2 outline-none mb-6" onChange={(e) => setEmail(e.target.value)} value={email} required />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password">Password</label>
              <input type="password" placeholder="Enter your password" className="border-b-2 border-gray-300 p-2 outline-none mb-6" onChange={(e) => setPassword(e.target.value)} value={password} required />
            </div>
            <button type="submit" className="w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all">
              Register
            </button>
          </form>

          <p className="text-sm text-center mt-6">
            Already have an account?{" "}
            <Link to="/admin" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
