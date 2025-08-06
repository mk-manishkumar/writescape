import React, { useEffect, useState, useCallback } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { axios, token } = useAppContext();

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/v1/admin/blogs");

      if (response.data.success) {
        setBlogs(response.data.blogs);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error(error.response?.data?.message || "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  }, [axios]);

  const deleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      const response = await axios.post(
        "/api/v1/blog/delete",
        { id: blogId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Blog deleted successfully");
        fetchBlogs(); // Refresh the list
      } else {
        toast.error(response.data.message || "Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error(error.response?.data?.message || "Failed to delete blog");
    }
  };

  useEffect(() => {
    if (token) {
      fetchBlogs();
    }
  }, [fetchBlogs, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 pt-6 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <div className="flex items-center justify-between max-w-4xl mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Blogs</h2>
        <span className="text-sm text-gray-600">Total: {blogs.length}</span>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-4xl">
          <p className="text-gray-500 text-lg">No blogs found.</p>
        </div>
      ) : (
        <div className="grid gap-6 max-w-4xl">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    {blog.image && <img src={blog.image} alt={blog.title} className="w-16 h-16 object-cover rounded-lg" />}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{blog.title}</h3>
                      <p className="text-sm text-gray-600">
                        By {blog.authorId?.fullname || "Unknown Author"} • <span className="text-primary">{blog.category}</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3 line-clamp-2" dangerouslySetInnerHTML={{ __html: blog.description }}></p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Published: {new Date(blog.createdAt).toLocaleDateString()}</span>
                    <span>Updated: {new Date(blog.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Link to={`/blog/${blog._id}`} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm transition-colors inline-block text-center">
                    View
                  </Link>
                  <Link to={`/admin/editblog/${blog._id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors inline-block text-center">
                    Edit
                  </Link>
                  <button onClick={() => deleteBlog(blog._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListBlog;
