import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import AdminProfileDetails from "../../components/admin/AdminProfileDetails";
import AdminProfileStats from "../../components/admin/AdminProfileStats";
import AdminProfileSettings from "../../components/admin/AdminProfileSettings";

const AdminProfile = () => {
  const { axios, admin, setAdmin, token, logout } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullname: "",
    email: "",
    profilePicture: null,
  });
  const [statsData, setStatsData] = useState({
    totalBlogs: 0,
    totalComments: 0,
    memberSince: null,
  });
  const [openAccordion, setOpenAccordion] = useState(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [delPassword, setDelPassword] = useState("");

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const res = await axios.get("/api/v1/admin/profile");
        if (res.data.success) {
          setAdmin(res.data.admin);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not load profile.");
      }
    };
    if (token) fetchAdminProfile();
  }, [token, setAdmin, axios]);

  useEffect(() => {
    if (admin) {
      setProfileData({
        fullname: admin.fullname || "",
        email: admin.email || "",
        profilePicture: null,
      });
    }
  }, [admin]);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await axios.get("/api/v1/admin/profile-stats");
        if (res.data.success) {
          setStatsData({
            totalBlogs: res.data.totalBlogs || 0,
            totalComments: res.data.totalComments || 0,
            memberSince: res.data.memberSince,
          });
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not load stats.");
      }
    };
    if (token) fetchAdminStats();
  }, [token, axios]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setProfileData((prev) => ({ ...prev, profilePicture: file }));
    }
  };

  const handleSave = async () => {
    if (!profileData.fullname.trim() || !profileData.email.trim()) {
      toast.error("Full name and email are required");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullname", profileData.fullname);
      formData.append("email", profileData.email);
      if (profileData.profilePicture) {
        formData.append("profilePicture", profileData.profilePicture);
      }
      const res = await axios.put("/api/v1/admin/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setAdmin(res.data.admin);
        setIsEditing(false);
        setProfileData((prev) => ({ ...prev, profilePicture: null }));
        toast.success("Profile updated successfully");
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (admin) {
      setProfileData({
        fullname: admin.fullname || "",
        email: admin.email || "",
        profilePicture: null,
      });
    }
    setIsEditing(false);
  };

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "AD";
  };

  const toggleAccordion = (name) => {
    setOpenAccordion((prev) => (prev === name ? null : name));
    if (openAccordion === name) {
      setOldPassword("");
      setNewPassword("");
      setDelPassword("");
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      toast.error("Both old and new passwords are required");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.put("/api/v1/admin/change-password", {
        oldPassword,
        newPassword,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setOpenAccordion(null);
        setOldPassword("");
        setNewPassword("");
      } else {
        toast.error(res.data.message || "Failed to change password");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!delPassword) {
      toast.error("Please enter your password to delete account");
      return;
    }
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.delete("/api/v1/admin/delete-account", {
        data: { password: delPassword },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setOpenAccordion(null);
        setDelPassword("");
        logout();
      } else {
        toast.error(res.data.message || "Failed to delete account");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <AdminProfileDetails admin={admin} profileData={profileData} isEditing={isEditing} isLoading={isLoading} handleInputChange={handleInputChange} handleImageChange={handleImageChange} handleSave={handleSave} handleCancel={handleCancel} setIsEditing={setIsEditing} getInitials={getInitials} />

      <AdminProfileStats statsData={statsData} />

      <AdminProfileSettings openAccordion={openAccordion} toggleAccordion={toggleAccordion} oldPassword={oldPassword} setOldPassword={setOldPassword} newPassword={newPassword} setNewPassword={setNewPassword} handleChangePassword={handleChangePassword} isLoading={isLoading} delPassword={delPassword} setDelPassword={setDelPassword} handleDeleteAccount={handleDeleteAccount} />
    </div>
  );
};

export default AdminProfile;
