import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import BlogTableItem from "../../components/admin/BlogTableItem";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    totalComments: 0,
    drafts: 0,
    recentBlogs: [],
  });

  const { axios } = useAppContext();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.get("/api/v1/admin/dashboard");
        data.success ? setDashboardData(data.dashboardData) : toast.error(data.message);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchDashboard();
  }, [axios]);

  return (
    <div className="flex-1 p-4 md:p-10 bg-blue-50/50">
      {/* Stat Cards Section */}
      <div className="flex flex-wrap gap-4">
        {/* Total Blogs Card */}
        <div className="flex items-center gap-4 bg-white p-4 rounded min-w-58 shadow cursor-pointer hover:scale-105 transition-all">
          <img src={assets.dashboard_icon_1} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashboardData.blogs}</p>
            <p className="text-gray-400 font-light">Blogs</p>
          </div>
        </div>
        {/* Total Comments Card */}
        <div className="flex items-center gap-4 bg-white p-4 rounded min-w-58 shadow cursor-pointer hover:scale-105 transition-all">
          <img src={assets.dashboard_icon_2} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashboardData.totalComments}</p>
            <p className="text-gray-400 font-light">Comments</p>
          </div>
        </div>
        {/* Total Drafts Card */}
        <div className="flex items-center gap-4 bg-white p-4 rounded min-w-58 shadow cursor-pointer hover:scale-105 transition-all">
          <img src={assets.dashboard_icon_3} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashboardData.drafts}</p>
            <p className="text-gray-400 font-light">Drafts</p>
          </div>
        </div>
      </div>

      {/* Latest Blogs Section */}
      <div>
        <div className="flex items-center gap-3 m-4 mt-6 text-gray-600">
          <img src={assets.dashboard_icon_4} alt="" />
          <p>Latest Blogs</p>
        </div>

        {/* Table displaying recent blogs */}
        <div className="relative max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white">
          <table className="w-full text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase text-left">
              <tr>
                <th scope="col" className="px-2 py-4 xl:px-6">
                  #
                </th>
                <th scope="col" className="px-6 py-3">
                  Blog Title
                </th>
                <th scope="col" className="px-6 py-3 max-sm:hidden">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 max-sm:hidden">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentBlogs.map((blog, index) => (
                <BlogTableItem
                  key={blog._id}
                  blog={blog}
                  fetchBlogs={() => {
                    axios
                      .get("/api/v1/admin/dashboard")
                      .then(({ data }) => {
                        if (data.success) setDashboardData(data.dashboardData);
                        else toast.error(data.message);
                      })
                      .catch((error) => toast.error(error.message));
                  }}
                  index={index + 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
