"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Settings, User, Lock, Calendar, Camera, Save, BellRing, Palette, LinkIcon } from 'lucide-react'
import Sidebar from "../components/SideBar"
import Topbar from "../components/TopBar"

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")
  const [darkMode, setDarkMode] = useState(false)
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=200&width=200")
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")

  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    location: "",
    JobTitle: "",
    department: "",
    joinDate: "",
    bio: "",
    image: "",
  })

  const getUserProfileData = async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        console.log("No token found, redirecting to login")
        // Assuming you have a navigate function or similar
        // navigate("/signin");
        return
      }

      const response = await axios.get("http://localhost:3000/api/v1/users/user", {
        headers: { Authorization: `Bearer ${token}` },
      })

      setUserInfo({
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        email: response.data.user.email,
        phoneNo: response.data.user.phoneNo,
        location: response.data.user.location || "",
        JobTitle: response.data.user.JobTitle || "",
        department: response.data.user.department || "",
        joinDate: response.data.user.joinDate || "",
        bio: response.data.user.bio || "",
      })

      // Check if user has an image and display it
      if (response.data.user.image && response.data.user.image.data) {
        // Convert the binary image data to a displayable format
        const imageBase64 = arrayBufferToBase64(response.data.user.image.data.data)
        const contentType = response.data.user.image.contentType
        setProfileImage(`data:${contentType};base64,${imageBase64}`)
      }

      console.log("User data fetched:", response.data.user)
    } catch (error) {
      console.log("Error fetching the user data", error)
    }
  }

  // Helper function to convert array buffer to base64
  const arrayBufferToBase64 = (buffer) => {
    let binary = ""
    const bytes = new Uint8Array(buffer)
    const len = bytes.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
  }

  useEffect(() => {
    getUserProfileData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = async () => {
    try {
      setIsUploading(true)
      setUploadError("")
      const token = localStorage.getItem("token")

      // Create FormData object to handle file upload
      const formData = new FormData()

      // Add all user info fields to the formData
      Object.keys(userInfo).forEach((key) => {
        if (key !== "image") {
          // Skip image as we'll handle it separately
          formData.append(key, userInfo[key])
        }
      })

      // Add the image file if one was selected
      if (selectedFile) {
        formData.append("profileImage", selectedFile)
      }

      console.log("Sending form data with fields:", Object.fromEntries(formData.entries()))

      const response = await axios.put("http://localhost:3000/api/v1/users/updateuser", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Profile updated successfully:", response.data)

      // Update the user info state with the response data
      setUserInfo(response.data.user)

      // Refresh the profile data to get the updated image
      getUserProfileData()

      setIsEditing(false)
    } catch (error) {
      console.error("Error updating user data:", error)
      setUploadError(error.response?.data?.msg || "Error updating profile")
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Image size should be less than 5MB")
        return
      }
      
      // Check file type
      if (!file.type.match('image.*')) {
        setUploadError("Please select an image file")
        return
      }
      
      setUploadError("")
      setSelectedFile(file) // store file for backend

      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target.result) // base64 preview
      }
      reader.readAsDataURL(file)
    }
  }
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Topbar title="Profile" />

        {/* Profile Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Profile Header */}
              <div className="relative h-48 bg-gradient-to-r from-emerald-500 to-teal-600">
                <div className="absolute -bottom-16 left-8">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700 overflow-hidden">
                      <img
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white cursor-pointer">
                      <Camera size={16} />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-20 px-8 pb-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userInfo.firstName} {userInfo.lastName}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {userInfo.JobTitle} • {userInfo.department}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 flex items-center"
                        >
                          <Save size={18} className="mr-2" />
                          Save Changes
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`py-4 text-sm font-medium border-b-2 ${
                        activeTab === "profile"
                          ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center">
                        <User size={16} className="mr-2" />
                        Profile
                      </div>
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                {activeTab === "profile" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                        </label>
                        {isEditing ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              name="firstName"
                              value={userInfo.firstName}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent"
                              placeholder="First Name"
                            />
                            
                            <input
                              type="text"
                              name="lastName"
                              value={userInfo.lastName}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent"
                              placeholder="Last Name"
                            />
                          </div>
                        ) : (
                          <p className="text-gray-900 dark:text-white">
                            {userInfo.firstName} {userInfo.lastName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email Address
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={userInfo.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white">
                            {userInfo.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Number
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phoneNo"
                            value={userInfo.phoneNo}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white">
                            {userInfo.phoneNo}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Location
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="location"
                            value={userInfo.location}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white">
                            {userInfo.location}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Job Title
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="JobTitle"
                            value={userInfo.JobTitle}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white">
                            {userInfo.JobTitle}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Department
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="department"
                            value={userInfo.department}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white">
                            {userInfo.department}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          value={userInfo.bio}
                          onChange={handleInputChange}
                          rows="4"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent"
                        ></textarea>
                      ) : (
                        <p className="text-gray-900 dark:text-white">
                          {userInfo.bio}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar size={16} className="mr-2" />
                      Member since {new Date(userInfo.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sidebar Navigation Item
function NavItem({ icon, text, isOpen, isActive, badge }) {
  return (
    <div
      className={`flex items-center ${
        isOpen ? "justify-start" : "justify-center"
      } p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive
          ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
      }`}
    >
      <div
        className={`${
          isActive ? "text-emerald-600 dark:text-emerald-400" : ""
        }`}
      >
        {icon}
      </div>
      {isOpen && (
        <div className="ml-3 flex-1 flex items-center justify-between">
          <span
            className={`font-medium ${
              isActive ? "text-emerald-600 dark:text-emerald-400" : ""
            }`}
          >
            {text}
          </span>
          {badge && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              {badge}
            </span>
          )}
        </div>
      )}
      {!isOpen && badge && (
        <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
          {badge}
        </span>
      )}
    </div>
  );
}
