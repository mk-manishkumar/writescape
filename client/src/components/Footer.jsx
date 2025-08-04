import React from "react";

const Footer = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/30">
      <div className="py-10 border-b border-gray-500 text-gray-500 flex justify-center">
        <div className="text-center max-w-xl">
          <h2 className="text-2xl text-primary font-semibold">📝WriteScape</h2>
          <p className="mt-2">WriteScape is your go-to platform for exploring and sharing captivating blogs across various categories. Join our community of writers and readers today!</p>
        </div>
      </div>

      <p className="py-5 text-center text-sm md:text-base text-gray-500">Copyright 2025 &copy; WriteScape - All Rights Reserved.</p>
    </div>
  );
};

export default Footer;
