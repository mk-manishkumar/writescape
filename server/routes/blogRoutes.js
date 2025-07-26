import express from "express";
import { addBlog, deleteBlog, togglePublishBlog, generateContent, getAllBlogs, getBlogById, addComment, getCommentsByBlogId, getUserBlogs } from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const blogRouter = express.Router();

blogRouter.get("/", getAllBlogs);
blogRouter.get("/:id", getBlogById);
blogRouter.get("/comments/:blogId", getCommentsByBlogId);
blogRouter.get("/my-blogs", auth, getUserBlogs);

blogRouter.post("/add", upload.single("image"), auth, addBlog);
blogRouter.post("/delete", auth, deleteBlog);
blogRouter.post("/toggle-publish", auth, togglePublishBlog);
blogRouter.post("/generate", auth, generateContent);
blogRouter.post("/add-comment", addComment);

export default blogRouter;
