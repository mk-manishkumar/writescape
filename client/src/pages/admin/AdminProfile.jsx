import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AdminProfile = () => {
  const { axios, admin, setAdmin, token } = useAppContext();
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

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const res = await axios.get("/api/v1/admin/profile");
        if (res.data.success) {
          setAdmin(res.data.admin);
        }
      } catch (error) {
        console.error("Error fetching admin profile:", error);
        toast.error(error.response?.data?.message || "Could not load profile.");
      }
    };
    if (token) {
      fetchAdminProfile();
    }
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

  // Fetch admin stats data using axios
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
        console.error("Error fetching admin stats:", error);
        toast.error(error.response?.data?.message || "Could not load stats.");
      }
    };
    if (token) {
      fetchAdminStats();
    }
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
      console.error("Error updating profile:", error);
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

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Profile</h1>
        <p className="text-gray-600">Manage your account information and settings</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Cover Background */}
        <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        {/* Profile Content */}
        <div className="px-6 pb-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6">
            <div className="relative mb-4 sm:mb-0">
              {admin?.profilePicture ? <img src={admin.profilePicture} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" /> : <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">{getInitials(admin?.fullname)}</div>}

              {isEditing && (
                <label htmlFor="profilepicture" className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer shadow-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input type="file" id="profilepicture" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name Field */}
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? <input type="text" name="fullname" value={profileData.fullname} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Enter your full name" /> : <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{admin?.fullname || "Not specified"}</div>}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                {isEditing ? <input type="email" name="email" value={profileData.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Enter your email" /> : <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{admin?.email || "Not specified"}</div>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t">
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="flex items-center justify-center px-6 py-3 bg-primary hover:bg-blue-700 text-white rounded-lg font-medium transition-colors cursor-pointer">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              ) : (
                <>
                  <button onClick={handleSave} disabled={isLoading} className="flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors">
                    {isLoading ? (
                      <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button onClick={handleCancel} disabled={isLoading} className="flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Cards with Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-800">{statsData.totalBlogs}</p>
              <p className="text-gray-600">Total Blogs</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-800">{statsData.totalComments}</p>
              <p className="text-gray-600">Comments</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-800">{statsData.memberSince ? new Date(statsData.memberSince).toLocaleDateString() : "-"}</p>
              <p className="text-gray-600">Member Since</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
