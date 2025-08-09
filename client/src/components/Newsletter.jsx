import React from "react";

const Newsletter = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 my-32">
      <h2 className="md:text-4xl text-2xl font-semibold">Never Miss a Blog!</h2>
      <p className="md:text-lg text-gray-500/70 pb-8">Stay updated with our latest blogs delivered straight to your inbox — subscribe to our newsletter!</p>
      <form className="flex flex-col md:flex-row items-center gap-3 max-w-2xl w-full px-4">
        <input type="email" placeholder="Enter your email" required className="flex-1 border border-gray-300 rounded-md outline-none px-4 py-3 text-gray-700 focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
        <button type="submit" className="bg-primary/90 hover:bg-primary text-white px-6 py-3 rounded-md transition-all w-fit">
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default Newsletter;
