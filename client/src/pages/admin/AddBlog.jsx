import React, { useEffect, useRef, useState } from "react";
import { assets, blogCategories } from "../../assets/assets";
import Quill from "quill";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { parse } from "marked";

const AddBlog = () => {
  const { axios } = useAppContext();

  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(false);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  // Function to create AI generated content
  const generateContent = async () => {
    if (!title) return toast.error("Please enter a title");

    try {
      setLoading(true);
      const response = await axios.post("/api/v1/blog/generate", { prompt: title });

      if (response.data.success) {
        quillRef.current.root.innerHTML = parse(response.data.content);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate content");
    } finally {
      setLoading(false);
    }
  };

  // Function to submit a blog
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsAdding(true);

    if (!title || !subTitle || !category || !image) {
      toast.error("Please fill in all required fields");
      setIsAdding(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subTitle", subTitle); 
      formData.append("description", quillRef.current.root.innerHTML); 
      formData.append("category", category);
      formData.append("isPublished", isPublished);
      formData.append("image", image);

      const response = await axios.post("/api/v1/blog/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Blog added successfully!");
        setImage(false);
        setTitle("");
        setSubTitle("");
        quillRef.current.root.innerHTML = "";
        setCategory("");
        setIsPublished(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add blog");
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  return (
    <form onSubmit={onSubmitHandler} className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll">
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        <p>Upload Thumbnail</p>
        <label htmlFor="image">
          <span className="sr-only">Upload Thumbnail</span>
          <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" className="mt-2 h-16 rounded cursor-pointer" />
          <input type="file" onChange={(e) => setImage(e.target.files[0])} id="image" accept="image/*" hidden required />
        </label>

        <p className="mt-4">Blog Title</p>
        <input type="text" placeholder="Type here" onChange={(e) => setTitle(e.target.value)} value={title} className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded" required />

        <p className="mt-4">SubTitle</p>
        <input type="text" placeholder="Enter Subtitle" onChange={(e) => setSubTitle(e.target.value)} value={subTitle} className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded" required />

        <p className="mt-4">Blog Content</p>
        <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
          <div ref={editorRef}></div>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 mt-2">
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
          {blogCategories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 mt-8">
          <input type="checkbox" id="isPublished" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="w-4 h-4" />
          <label htmlFor="isPublished" className="text-sm text-gray-700">
            Publish immediately
          </label>
        </div>

        <button disabled={isAdding} type="submit" className="mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm disabled:opacity-50">
          {isAdding ? "Adding..." : "Add Blog"}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;
