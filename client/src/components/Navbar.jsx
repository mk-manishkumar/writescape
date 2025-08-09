import React from "react";
import { assets } from "./../assets/assets";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const { navigate, admin, token } = useAppContext();

  const isAuthenticated = admin || token;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-5 px-4 sm:px-8 lg:px-20 xl:px-32">
      <Link to={"/"} className="text-2xl text-primary font-semibold cursor-pointer">
        📝WriteScape
      </Link>

      <button onClick={() => navigate("/admin")} className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-6 sm:px-8 lg:px-10 py-2.5 hover:scale-105 transition-all">
        <span>{isAuthenticated ? "Dashboard" : "Login"}</span>
        <img src={assets.arrow} alt="arrow" className="w-3" />
      </button>
    </div>
  );
};

export default Navbar;
