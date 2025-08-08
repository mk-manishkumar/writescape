import Blog from "../models/Blog.model.js";
import Comment from "../models/Comment.model.js";
import main from "../configs/gemini.js";
import imagekit from "../configs/imagekit.js";

export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    let imageUrl = null;

    // Upload image to ImageKit if provided
    if (req.file) {
      try {
        const uploadResult = await imagekit.upload({
          file: req.file.buffer,
          fileName: `blog_${Date.now()}_${req.file.originalname}`,
          folder: "/blogs",
        });
        imageUrl = uploadResult.url;
      } catch (uploadError) {
        console.log("Image upload error:", uploadError);
        return res.status(500).json({ success: false, message: "Image upload failed" });
      }
    }

    const newBlog = await Blog.create({
      title,
      subTitle,
      description,
      category,
      image: imageUrl,
      isPublished: isPublished === "true",
      authorId: req.admin.id,
    });

    res.status(201).json({ success: true, blog: newBlog });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).populate("authorId", "fullname email");
    res.status(200).json({ success: true, blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("authorId", "fullname email");
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.status(200).json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ authorId: req.admin.id }).populate("authorId", "fullname email");
    res.status(200).json({ success: true, blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subTitle, description, category, isPublished } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    if (blog.authorId.toString() !== req.admin.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    let imageUrl = blog.image;

    // Upload new image if provided
    if (req.file) {
      try {
        const uploadResult = await imagekit.upload({
          file: req.file.buffer,
          fileName: `blog_${Date.now()}_${req.file.originalname}`,
          folder: "/blogs",
        });
        imageUrl = uploadResult.url;
      } catch (uploadError) {
        console.log("Image upload error:", uploadError);
        return res.status(500).json({ success: false, message: "Image upload failed" });
      }
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        subTitle,
        description,
        category,
        image: imageUrl,
        isPublished: isPublished === "true",
      },
      { new: true }
    );

    res.status(200).json({ success: true, blog: updatedBlog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    if (blog.authorId.toString() !== req.admin.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await blog.deleteOne();
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

    if (blog.authorId.toString() !== req.admin.id) {
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
    const comments = await Comment.find({ blog: req.params.blogId, isApproved: true });
    res.status(200).json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ========================= Like a blog controller =====================
export const likeBlog = async (req, res) => {
  try {
    const adminId = req.admin.id; 
    const { blogId } = req.body;

    if (!blogId) {
      return res.status(400).json({ success: false, message: "Blog ID is required" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    if (blog.authorId.toString() === adminId) {
      return res.status(400).json({ success: false, message: "Cannot like your own blog" });
    }

    if (blog.likedBy.includes(adminId)) {
      return res.status(400).json({ success: false, message: "You have already liked this blog" });
    }

    blog.likedBy.push(adminId);
    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog liked",
      likesCount: blog.likedBy.length, 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

