import express from "express";
import { addBlog, deleteBlog, togglePublishBlog, generateContent, getAllBlogs, getBlogById, addComment, getCommentsByBlogId, getUserBlogs, updateBlog, likeBlog } from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const blogRouter = express.Router();

// Specific routes first (before parameterized routes)
blogRouter.get("/my-blogs", auth, getUserBlogs);
blogRouter.get("/comments/:blogId", getCommentsByBlogId);

// General routes
blogRouter.get("/", getAllBlogs);

// Parameterized routes last
blogRouter.get("/:id", getBlogById);

// POST routes
blogRouter.post("/add", upload.single("image"), auth, addBlog);
blogRouter.post("/delete", auth, deleteBlog);
blogRouter.post("/toggle-publish", auth, togglePublishBlog);
blogRouter.post("/generate", auth, generateContent);
blogRouter.post("/like", auth, likeBlog);
blogRouter.post("/add-comment", addComment);

// Update a blog post by ID
blogRouter.put("/update/:id", upload.single("image"), auth, updateBlog);

export default blogRouter;
