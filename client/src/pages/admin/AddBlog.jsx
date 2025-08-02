import React, { useEffect, useRef, useState } from "react";
import { assets, blogCategories } from "../../assets/assets";
import Quill from "quill";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { parse } from "marked";

const AddBlog = () => {
  const { token } = useAppContext(); 
  const backendUrl = import.meta.env.VITE_BASE_URL;

  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); 
  const [category, setCategory] = useState("");

  const generateContent = async () => {
    if (!title) return toast.error("Please enter a title");

    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/blog/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: title }),
      });

      const data = await response.json();

      if (data.success) {
        quillRef.current.root.innerHTML = parse(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsAdding(true);

      if (!title || !description || !category || !image) {
        toast.error("Please fill in all required fields");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description); // Updated field name
      formData.append("content", quillRef.current.root.innerHTML); // Updated field name
      formData.append("category", category);
      formData.append("image", image);

      const response = await fetch(`${backendUrl}/api/blog/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Added authorization header
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Blog added successfully!");
        // Reset form
        setImage(false);
        setTitle("");
        setDescription("");
        quillRef.current.root.innerHTML = "";
        setCategory("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error adding blog:", error);
      toast.error("Failed to add blog");
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    // Initialize Quill editor only once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  return (
    <form onSubmit={onSubmitHandler} className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll">
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        <p>Upload Thumbnail</p>
        <label htmlFor="image">
          <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" className="mt-2 h-16 rounded cursor-pointer" />
          <input type="file" onChange={(e) => setImage(e.target.files[0])} name="" id="image" aria-label="Upload Thumbnail" accept="image/*" hidden required />
        </label>

        <p className="mt-4">Blog Title</p>
        <input type="text" placeholder="Type here" onChange={(e) => setTitle(e.target.value)} value={title} className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded" required />

        <p className="mt-4">Blog Description</p>
        <input type="text" placeholder="Brief description of your blog" onChange={(e) => setDescription(e.target.value)} value={description} className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded" required />

        <p className="mt-4">Blog Content</p>
        <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
          <div ref={editorRef}></div>
          {loading && (
            <div className="absolute right-0 top-0 left-0 bottom-0 flex items-center justify-center bg-black/10 mt-2">
              <div className="w-8 h-8 rounded-full border-2 border-t-white animate-spin"></div>
            </div>
          )}
          <button disabled={loading} type="button" onClick={generateContent} className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer">
            Generate with AI
          </button>
        </div>

        <p className="mt-4">Blog Category</p>
        <select onChange={(e) => setCategory(e.target.value)} name="category" value={category} className="mt-2 px-3 py-2 border border-gray-300 text-gray-500 outline-none rounded" required>
          <option value="">Select Category</option>
          {blogCategories.map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
        </select>

        <button disabled={isAdding} type="submit" className="mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm disabled:opacity-50">
          {isAdding ? "Adding..." : "Add Blog"}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;
