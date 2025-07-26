import Blog from "../models/Blog.model.js";
import Comment from "../models/Comment.model.js";
import main from "../configs/gemini.js";

export const addBlog = async (req, res) => {
  try {
    const { title, subtitle, description, category, isPublished } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!title || !description || !category) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const newBlog = await Blog.create({
      title,
      subtitle,
      description,
      category,
      image,
      isPublished,
      author: req.user._id,
    });

    res.status(201).json({ success: true, blog: newBlog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).populate("author", "name email"); 
    res.status(200).json({ success: true, blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name email");
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.status(200).json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id });
    res.status(200).json({ success: true, blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    if (blog.author.toString() !== req.user._id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await blog.deleteOne(); // ✅ Safer than findByIdAndDelete
    await Comment.deleteMany({ blog: id });

    res.status(200).json({ success: true, message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const togglePublishBlog = async (req, res) => {
  try {
    const { id } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    if (blog.author.toString() !== req.user._id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    blog.isPublished = !blog.isPublished;
    await blog.save();

    res.status(200).json({ success: true, message: "Blog publish status updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required" });

    const aiResponse = await main(prompt + " Generate a blog content for this topic in simple text format");

    res.status(200).json({ success: true, content: aiResponse });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { blogId, name, text } = req.body;
    if (!blogId || !name || !text) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const comment = await Comment.create({ blog: blogId, name, text });
    res.status(201).json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCommentsByBlogId = async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId });
    res.status(200).json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
