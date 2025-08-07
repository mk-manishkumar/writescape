import React from "react";

const AdminProfileSettings = ({ openAccordion, toggleAccordion, oldPassword, setOldPassword, newPassword, setNewPassword, handleChangePassword, isLoading, delPassword, setDelPassword, handleDeleteAccount }) => (
  <div className="mt-12 space-y-6 max-w-lg mx-auto">
    {/* Change Password */}
    <div className="border rounded-lg bg-white shadow p-6">
      <button className="w-full text-left text-xl font-semibold text-gray-800 flex justify-between items-center" onClick={() => toggleAccordion("changePassword")}>
        Change Password
        <span>{openAccordion === "changePassword" ? "-" : "+"}</span>
      </button>
      {openAccordion === "changePassword" && (
        <div className="mt-4 space-y-4">
          <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <div className="flex space-x-4">
            <button onClick={handleChangePassword} disabled={isLoading} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? "Changing..." : "Change Password"}
            </button>
            <button onClick={() => toggleAccordion("changePassword")} disabled={isLoading} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
    {/* Delete Account */}
    <div className="border rounded-lg bg-white shadow p-6">
      <button className="w-full text-left text-xl font-semibold text-gray-800 flex justify-between items-center" onClick={() => toggleAccordion("deleteAccount")}>
        Delete Account
        <span>{openAccordion === "deleteAccount" ? "-" : "+"}</span>
      </button>
      {openAccordion === "deleteAccount" && (
        <div className="mt-4 space-y-4">
          <input type="password" placeholder="Enter your password" value={delPassword} onChange={(e) => setDelPassword(e.target.value)} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500" />
          <div className="flex space-x-4">
            <button onClick={handleDeleteAccount} disabled={isLoading} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? "Deleting..." : "Delete Account"}
            </button>
            <button onClick={() => toggleAccordion("deleteAccount")} disabled={isLoading} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default AdminProfileSettings;
