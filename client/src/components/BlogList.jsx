import React, { useState } from "react";
import { blogCategories } from "../assets/assets";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import BlogCard from "./BlogCard";
import { useAppContext } from "../context/AppContext";

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const { blogs, input, isLoading } = useAppContext(); 

  const filteredBlogs = () => {
    if (!blogs || blogs.length === 0) return [];

    if (input === "") {
      return blogs;
    }
    return blogs.filter((blog) => blog.title?.toLowerCase().includes(input.toLowerCase()) || blog.category?.toLowerCase().includes(input.toLowerCase()));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredAndCategorizedBlogs = filteredBlogs().filter((blog) => (menu === "All" ? true : blog.category === menu));

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-6 my-6 px-4 overflow-x-auto scrollbar-hide">
        {blogCategories.map((item) => (
          <div key={item} className="relative">
            <button
              onClick={() => setMenu(item)}
              className={`cursor-pointer text-gray-500 whitespace-nowrap px-3 py-1 rounded-full transition-colors duration-200
          ${menu === item ? "bg-primary text-white" : "hover:bg-gray-100"}`}
            >
              {item}
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40">
        {filteredAndCategorizedBlogs.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-500 text-lg">{input ? "No blogs found matching your search." : "No blogs available."}</p>
          </div>
        ) : (
          filteredAndCategorizedBlogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
        )}
      </div>
    </div>
  );
};

export default BlogList;
