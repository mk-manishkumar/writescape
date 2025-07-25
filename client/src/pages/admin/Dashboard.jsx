import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaBlog } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalBlogs: 0,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.get("api/v1/admin/dashboard");
        if (data.success) {
          setDashboard(data.data);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <FaUsers className="text-blue-500 text-3xl mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-xl font-semibold text-gray-800">{dashboard.totalUsers}</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <MdAdminPanelSettings className="text-green-500 text-3xl mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">Total Admins</p>
            <p className="text-xl font-semibold text-gray-800">{dashboard.totalAdmins}</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <FaBlog className="text-purple-500 text-3xl mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">Total Blogs</p>
            <p className="text-xl font-semibold text-gray-800">{dashboard.totalBlogs}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
