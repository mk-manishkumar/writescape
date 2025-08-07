import jwt from "jsonwebtoken";
import Blog from "../models/Blog.model.js";
import Admin from "../models/Admin.model.js";
import Comment from "../models/Comment.model.js";
import imagekit from "../configs/imagekit.js";

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// ================== AUTH CONTROLLERS =====================
export const registerAdmin = async (req, res) => {
  try {
    const { email, fullname, password } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const admin = await Admin.create({ email, fullname, password });

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "7d" });

    res
      .status(201)
      .cookie("token", token, COOKIE_OPTIONS)
      .json({
        success: true,
        message: "User registered successfully",
        admin: {
          id: admin._id,
          email: admin.email,
          fullname: admin.fullname,
        },
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        fullname: admin.fullname,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .status(200)
      .cookie("token", token, COOKIE_OPTIONS)
      .json({
        success: true,
        message: "Login successful",
        admin: {
          id: admin._id,
          email: admin.email,
          fullname: admin.fullname,
        },
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutAdmin = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// ============= BLOG CONTROLLERS =========================
export const getAllBlogsByAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate("authorId", "fullname email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({}).populate("blog").sort({ createdAt: -1 });
    res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);
    const totalBlogs = await Blog.countDocuments();
    const totalComments = await Comment.countDocuments();
    const drafts = await Blog.countDocuments({ isPublished: false });

    const dashboardData = {
      recentBlogs,
      totalBlogs,
      totalComments,
      drafts,
      blogs: totalBlogs,
    };

    res.status(200).json({ success: true, dashboardData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCommentById = async (req, res) => {
  try {
    const { id } = req.body;
    await Comment.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveCommentById = async (req, res) => {
  try {
    const { id } = req.body;
    await Comment.findByIdAndUpdate(id, { isApproved: true });
    res.status(200).json({ success: true, message: "Comment approved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================== CONTROLLER TO GET PROFILE ============================
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    res.json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        fullname: admin.fullname,
        profilePicture: admin.profilePicture,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ================== UPDATE ADMIN PROFILE ============================
export const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { fullname, email } = req.body;

    if (!fullname || !email) {
      return res.status(400).json({ success: false, message: "Full name and email are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address" });
    }

    const existingAdmin = await Admin.findOne({
      email: email.toLowerCase(),
      _id: { $ne: adminId },
    });

    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Email is already registered with another account" });
    }

    const updateData = {
      fullname: fullname.trim(),
      email: email.toLowerCase().trim(),
    };

    if (req.file) {
      try {
        const uploadResult = await imagekit.upload({
          file: req.file.buffer,
          fileName: `profile_${adminId}_${Date.now()}`,
          folder: "/admin_profiles", 
        });
        // Save the secure URL from ImageKit
        updateData.profilePicture = uploadResult.url;
      } catch (uploadError) {
        console.error("ImageKit upload error:", uploadError);
        return res.status(500).json({ success: false, message: "Profile picture upload failed." });
      }
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateData, { new: true }).select("-password");

    if (!updatedAdmin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      admin: {
        id: updatedAdmin._id,
        email: updatedAdmin.email,
        fullname: updatedAdmin.fullname,
        profilePicture: updatedAdmin.profilePicture,
        createdAt: updatedAdmin.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================== ADMIN STATS ============================
export const getAdminProfileStats = async (req, res) => {
  try {
    const adminId = req.admin.id;

    const totalBlogs = await Blog.countDocuments({ authorId: adminId });

    const adminBlogs = await Blog.find({ authorId: adminId }).select("_id");
    const blogIds = adminBlogs.map((blog) => blog._id);
    const totalComments = await Comment.countDocuments({ blog: { $in: blogIds } });

    const admin = await Admin.findById(adminId).select("createdAt");

    res.status(200).json({
      success: true,
      totalBlogs,
      totalComments,
      memberSince: admin?.createdAt,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =================== Change Password Controller ================
export const changePassword = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Old and new passwords are required" });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const isMatch = await admin.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Old password is incorrect" });
    }

    admin.password = newPassword; 
    await admin.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================= Delete Account Controller =======================
export const deleteAccount = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Password is incorrect" });
    }

    // Delete all blogs authored by this admin
    const blogs = await Blog.find({ authorId: adminId });
    const blogIds = blogs.map((b) => b._id);

    // Delete related comments for these blogs
    await Comment.deleteMany({ blog: { $in: blogIds } });

    // Delete blogs authored by admin
    await Blog.deleteMany({ authorId: adminId });

    // Comments authored by admin on other blogs if those exist.
    await Comment.deleteMany({ authorId: adminId });

    // Delete admin account
    await Admin.findByIdAndDelete(adminId);

    // Clear token cookie (logout)
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
