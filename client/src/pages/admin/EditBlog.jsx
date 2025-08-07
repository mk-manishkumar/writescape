import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import { blogCategories } from "../../assets/assets";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    description: "",
    category: "",
    isPublished: false,
  });
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");

  const { axios, token } = useAppContext();

  const fetchBlog = useCallback(async () => {
    try {
      const response = await axios.get(`/api/v1/blog/${id}`);
      if (response.data.success) {
        const blog = response.data.blog;
        setFormData({
          title: blog.title,
          subTitle: blog.subTitle || "",
          description: blog.description,
          category: blog.category,
          isPublished: blog.isPublished,
        });
        setCurrentImage(blog.image || "");
      } else {
        toast.error("Failed to fetch blog data");
      }
    } catch {
      toast.error("Failed to fetch blog data");
    } finally {
      setLoading(false);
    }
  }, [axios, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("subTitle", formData.subTitle);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("isPublished", formData.isPublished);

      if (image) {
        formDataToSend.append("image", image);
      }

      // Fixed: Use correct API endpoint with /api/v1
      const response = await axios.put(`/api/v1/blog/update/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Blog updated successfully");
        navigate("/admin/listblog");
      } else {
        toast.error(response.data.message || "Failed to update blog");
      }
    } catch {
      toast.error("Failed to update blog");
    }
  };

  useEffect(() => {
    if (token) {
      fetchBlog();
    }
  }, [token, fetchBlog]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 pt-6 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <div className="max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Blog</h2>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input id="title" type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select onChange={(e) => setFormData({ ...formData, category: e.target.value })} name="category" value={formData.category} className="px-3 py-2 border border-gray-300 outline-none rounded w-full" required>
                <option value="">Select Category</option>
                {blogCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input id="subtitle" type="text" value={formData.subTitle} onChange={(e) => setFormData({ ...formData, subTitle: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="8" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div className="mb-6">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Blog Image
            </label>
            {currentImage && (
              <div className="mb-4">
                <img src={currentImage} alt="Current" className="w-32 h-32 object-cover rounded-lg" />
                <p className="text-sm text-gray-500 mt-2">Current image</p>
              </div>
            )}
            <input id="image" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} className="mr-2" />
              <span className="text-sm font-medium text-gray-700">Publish immediately</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="bg-primary hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer">
              Update Blog
            </button>
            <button type="button" onClick={() => navigate("/admin/listblog")} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
