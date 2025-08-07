import React from "react";

const AdminProfileDetails = ({ admin, profileData, isEditing, isLoading, handleInputChange, handleImageChange, handleSave, handleCancel, setIsEditing, getInitials }) => (
  <>
    {/* Header */}
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Profile</h1>
      <p className="text-gray-600">Manage your account information and settings</p>
    </div>

    {/* Profile Card */}
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6">
          <div className="relative mb-4 sm:mb-0">
            {admin?.profilePicture ? <img src={admin.profilePicture} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" /> : <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">{getInitials(admin?.fullname)}</div>}

            {isEditing && (
              <label htmlFor="profilepicture" aria-label="Upload profile picture" className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer shadow-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input type="file" id="profilepicture" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Profile Information and edit form */}
        <div className="border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {isEditing ? <input type="text" name="fullname" value={profileData.fullname} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Enter your full name" /> : <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{admin?.fullname || "Not specified"}</div>}
            </div>
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
                <button onClick={handleSave} disabled={isLoading} className="flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors cursor-pointer">
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
                <button onClick={handleCancel} disabled={isLoading} className="flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors cursor-pointer">
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
  </>
);

export default AdminProfileDetails;
