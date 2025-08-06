import React from "react";
import axios from "axios";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  const { title, createdAt } = blog;
  const BlogDate = new Date(createdAt);
  const { token } = useAppContext();

  const deleteBlog = async () => {
    const confirm = window.confirm("Are you sure you want to delete this blog?");
    if (!confirm) return;

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/blog/delete`,
        { id: blog._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete blog");
    }
  };

  const togglePublish = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/blog/toggle-publish`,
        { id: blog._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to toggle publish status");
    }
  };

  return (
    <tr className="border-y border-gray-300">
      <th className="px-2 py-4">{index}</th>
      <td className="px-2 py-4">{title}</td>
      <td className="px-2 py-4 max-sm:hidden">{BlogDate.toLocaleDateString()}</td>
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
