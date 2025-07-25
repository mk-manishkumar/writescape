import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get("/api/v1/admin/blogs");
        if (data.success) {
          setBlogs(data.blogs);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch blogs.");
      }
    };

    fetchBlogs();
  }, []); 

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Blogs</h2>
      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <ul className="space-y-2">
          {blogs.map((blog) => (
            <li key={blog._id} className="border p-4 rounded-md">
              <h3 className="text-lg font-semibold">{blog.title}</h3>
              <p className="text-sm text-gray-600">{blog.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListBlog;
