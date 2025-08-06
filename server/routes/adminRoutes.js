import express from "express";
import { registerAdmin, loginAdmin, approveCommentById, deleteCommentById, getAllBlogsByAdmin, getAllComments, getDashboardData, logoutAdmin, updateAdminProfile, getAdminProfileStats, getAdminProfile } from "../controllers/adminController.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const adminRouter = express.Router();

// Auth routes
adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/logout", logoutAdmin);

// Protected routes
adminRouter.get("/comments", auth, getAllComments);
adminRouter.get("/blogs", auth, getAllBlogsByAdmin);
adminRouter.post("/delete-comment", auth, deleteCommentById);
adminRouter.post("/approve-comment", auth, approveCommentById);
adminRouter.get("/dashboard", auth, getDashboardData);
adminRouter.get("/profile", auth, getAdminProfile);
adminRouter.get("/profile-stats", auth, getAdminProfileStats);

// update Profile route
adminRouter.put("/profile", auth, upload.single("profilePicture"), updateAdminProfile);

export default adminRouter;
