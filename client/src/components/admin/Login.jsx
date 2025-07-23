import React, { useState } from "react";

const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full py-6 text-center">
            <h2 className="text-3xl font-bold">
              <span className="text-primary">Admin</span> Login
            </h2>
            <p className="font-light text-sm">Enter your credentials to access the Admin Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 w-full sm:max-w-md text-gray-600">
            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <input type="email" placeholder="Enter your email" className="border-b-2 border-gray-300 p-2 outline-none mb-6" onChange={(e) => setEmail(e.target.value)} value={email} required />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password">Password</label>
              <input type="password" placeholder="Enter your password" className="border-b-2 border-gray-300 p-2 outline-none mb-6" onChange={(e) => setPassword(e.target.value)} value={password} required />
            </div>
            <button type="submit" className="w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
