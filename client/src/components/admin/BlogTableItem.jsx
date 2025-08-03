import React from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  const { title, date } = blog; 
  const BlogDate = new Date(date); 

  const { token } = useAppContext(); 

  const deleteBlog = async () => {
    const confirm = window.confirm("Are you sure you want to delete this blog?");
    if (!confirm) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/blog/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: blog._id }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete blog");
    }
  };

  const togglePublish = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/blog/toggle-publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: blog._id }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to toggle publish status");
    }
  };

  return (
    <tr className="border-y border-gray-300">
      <th className="px-2 py-4">{index}</th>
      <td className="px-2 py-4">{title}</td>
      <td className="px-2 py-4 max-sm:hidden">{BlogDate.toLocaleString()}</td>
      <td className="px-2 py-4 max-sm:hidden">
        <p className={`${blog.isPublished ? "text-green-600" : "text-orange-700"}`}>{blog.isPublished ? "Published" : "Unpublished"}</p>
      </td>
      <td className="px-2 py-4 flex text-xs gap-3">
        <button onClick={togglePublish} className="border px-2 py-0.5 mt-1 rounded cursor-pointer hover:bg-gray-50 transition-all">
          {blog.isPublished ? "Unpublish" : "Publish"}
        </button>
        <button onClick={deleteBlog} className="w-8 hover:scale-110 transition-all cursor-pointer">
          <img src={assets.cross_icon} alt="Delete blog" />
        </button>
      </td>
    </tr>
  );
};

export default BlogTableItem;
