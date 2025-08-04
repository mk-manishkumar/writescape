import React from "react";
import { assets } from "./../assets/assets";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const { navigate, admin, token } = useAppContext();

  const isAuthenticated = admin || token;

  return (
    <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">
      <Link to={"/"} className="text-2xl text-primary font-semibold cursor-pointer">
        📝WriteScape
      </Link>
      <button onClick={() => navigate("/admin")} className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5 hover:scale-105 transition-all">
        <span>{isAuthenticated ? "Dashboard" : "Login"}</span>
        <img src={assets.arrow} alt="arrow" className="w-3" />
      </button>
    </div>
  );
};

export default Navbar;
