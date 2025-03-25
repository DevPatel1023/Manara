"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  Menu,
  X,
  Home,
  Users,
  ClipboardList,
  FileText,
  Bell,
  Settings,
  User,
  Lock,
  Calendar,
  Camera,
  Save,
  LogOut,
  Moon,
  Sun,
  Globe,
  BellRing,
  Palette,
  LinkIcon,
  Check,
  Key,
  Github,
  Twitter,
  Linkedin,
  Facebook,
  Slack,
} from "lucide-react"

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")
  const [darkMode, setDarkMode] = useState(false)
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=200&width=200")
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    jobTitle: "",
    department: "",
    joinDate: "",
    bio: "",
  })

  const getUserProfileData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/users/user")
      setUserInfo({
        name: response.data.user.firstName,
        email: response.data.user.email,
        phone: response.data.user.phone,
        location: response.data.user.location,
        jobTitle: response.data.user.jobTitle,
        department: response.data.user.department,
        joinDate: response.data.user.joinDate,
        bio: response.data.user.bio,
      })
    } catch (error) {
      console.log("Error fetching the user data", error)
    }
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
      await axios.put("http://localhost:3000/api/v1/users/update", userInfo)
      setIsEditing(false)
    } catch (error) {
      console.log("Error updating user data", error)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sidebar */}
      <div
        className={`bg-white dark:bg-gray-800 shadow-lg ${
          isOpen ? "w-64" : "w-20"
        } transition-all duration-300 z-20 border-r border-gray-200 dark:border-gray-700 relative`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          {isOpen ? (
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl">
                Q
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                QuoteFlow
              </span>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl mx-auto">
              Q
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition duration-200"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="p-4">
          <nav className="flex flex-col gap-2">
            <NavItem icon={<Home size={20} />} text="Dashboard" isOpen={isOpen} />
            <NavItem icon={<Users size={20} />} text="Customers" isOpen={isOpen} />
            <NavItem icon={<ClipboardList size={20} />} text="Quotations" isOpen={isOpen} />
            <NavItem icon={<FileText size={20} />} text="Invoices" isOpen={isOpen} />
            <NavItem icon={<Bell size={20} />} text="Notifications" isOpen={isOpen} badge="5" />
            <NavItem icon={<Settings size={20} />} text="Settings" isOpen={isOpen} isActive={true} />
          </nav>
        </div>

        {isOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <img src={profileImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{userInfo.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{userInfo.jobTitle}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Profile Settings</h1>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                {darkMode ? (
                  <Sun size={20} className="text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon size={20} className="text-gray-600 dark:text-gray-300" />
                )}
              </button>

              <button className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  5
                </span>
              </button>

              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <img src={profileImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

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
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-20 px-8 pb-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{userInfo.name}</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {userInfo.jobTitle} • {userInfo.department}
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
                    <button
                      onClick={() => setActiveTab("account")}
                      className={`py-4 text-sm font-medium border-b-2 ${
                        activeTab === "account"
                          ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center">
                        <Settings size={16} className="mr-2" />
                        Account
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab("security")}
                      className={`py-4 text-sm font-medium border-b-2 ${
                        activeTab === "security"
                          ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center">
                        <Lock size={16} className="mr-2" />
                        Security
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab("notifications")}
                      className={`py-4 text-sm font-medium border-b-2 ${
                        activeTab === "notifications"
                          ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center">
                        <BellRing size={16} className="mr-2" />
                        Notifications
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab("appearance")}
                      className={`py-4 text-sm font-medium border-b-2 ${
                        activeTab === "appearance"
                          ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center">
                        <Palette size={16} className="mr-2" />
                        Appearance
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab("connected")}
                      className={`py-4 text-sm font-medium border-b-2 ${
                        activeTab === "connected"
                          ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center">
                        <LinkIcon size={16} className="mr-2" />
                        Connected Accounts
                      </div>
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                {activeTab === "profile" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Full Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            value={userInfo.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white">{userInfo.name}</p>
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
                          <p className="text-gray-900 dark:text-white">{userInfo.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Phone Number
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={userInfo.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white">{userInfo.phone}</p>
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
                          <p className="text-gray-900 dark:text-white">{userInfo.location}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Job Title
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="jobTitle"
                            value={userInfo.jobTitle}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white">{userInfo.jobTitle}</p>
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
                          <p className="text-gray-900 dark:text-white">{userInfo.department}</p>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          value={userInfo.bio}
                          onChange={handleInputChange}
                          rows="4"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent"
                        ></textarea>
                      ) : (
                        <p className="text-gray-900 dark:text-white">{userInfo.bio}</p>
                      )}
                    </div>

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar size={16} className="mr-2" />
                      Member since {userInfo.joinDate}
                    </div>
                  </div>
                )}

                {activeTab === "account" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Settings</h3>

                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-base font-medium text-gray-900 dark:text-white">Email Preferences</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your email settings</p>
                          </div>
                          <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium">
                            Edit
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-base font-medium text-gray-900 dark:text-white">Language & Region</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Set your language and regional preferences
                            </p>
                          </div>
                          <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium">
                            Edit
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-base font-medium text-gray-900 dark:text-white">Billing Information</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Manage your billing details and payment methods
                            </p>
                          </div>
                          <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium">
                            Edit
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-base font-medium text-gray-900 dark:text-white">Export Your Data</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Download a copy of your data</p>
                          </div>
                          <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium">
                            Export
                          </button>
                        </div>
                      </div>

                      <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4 border border-red-200 dark:border-red-800/20">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-base font-medium text-red-600 dark:text-red-400">Delete Account</h4>
                            <p className="text-sm text-red-500 dark:text-red-300">
                              Permanently delete your account and all data
                            </p>
                          </div>
                          <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "security" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h3>

                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h4 className="text-base font-medium text-gray-900 dark:text-white">Change Password</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Update your password regularly to keep your account secure
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Current Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent"
                              placeholder="Enter current password"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              New Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent"
                              placeholder="Enter new password"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent"
                              placeholder="Confirm new password"
                            />
                          </div>

                          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 flex items-center">
                            <Key size={16} className="mr-2" />
                            Update Password
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-base font-medium text-gray-900 dark:text-white">
                              Two-Factor Authentication
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2 text-sm text-green-600 dark:text-green-400 font-medium">Enabled</span>
                            <div className="relative inline-block w-10 h-5 rounded-full bg-green-500">
                              <input type="checkbox" className="sr-only" checked />
                              <span className="absolute inset-y-0 right-0 w-5 h-5 rounded-full bg-white transform translate-x-0"></span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-base font-medium text-gray-900 dark:text-white">Login Sessions</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your active sessions</p>
                          </div>
                          <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium">
                            View All
                          </button>
                        </div>

                        <div className="mt-4 space-y-3">
                          <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                                <Globe size={16} />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Chrome on Windows</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  New York, USA • Current session
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                                <Globe size={16} />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Safari on iPhone</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">New York, USA • 2 days ago</p>
                              </div>
                            </div>
                            <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm">
                              <LogOut size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-base font-medium text-gray-900 dark:text-white">Security Log</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              View your recent security activity
                            </p>
                          </div>
                          <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium">
                            View All
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Notification Preferences
                    </h3>

                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                          Email Notifications
                        </h4>

                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Quote Updates</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Receive notifications when quotes are created, updated, or approved
                              </p>
                            </div>
                            <div className="relative inline-block w-10 h-5 rounded-full bg-emerald-500">
                              <input type="checkbox" className="sr-only" checked />
                              <span className="absolute inset-y-0 right-0 w-5 h-5 rounded-full bg-white transform translate-x-0"></span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Invoice Updates</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Receive notifications when invoices are created, updated, or paid
                              </p>
                            </div>
                            <div className="relative inline-block w-10 h-5 rounded-full bg-emerald-500">
                              <input type="checkbox" className="sr-only" checked />
                              <span className="absolute inset-y-0 right-0 w-5 h-5 rounded-full bg-white transform translate-x-0"></span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Customer Updates</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Receive notifications when customer information is updated
                              </p>
                            </div>
                            <div className="relative inline-block w-10 h-5 rounded-full bg-gray-300 dark:bg-gray-600">
                              <input type="checkbox" className="sr-only" />
                              <span className="absolute inset-y-0 left-0 w-5 h-5 rounded-full bg-white transform translate-x-0"></span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">System Updates</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Receive notifications about system updates and maintenance
                              </p>
                            </div>
                            <div className="relative inline-block w-10 h-5 rounded-full bg-emerald-500">
                              <input type="checkbox" className="sr-only" checked />
                              <span className="absolute inset-y-0 right-0 w-5 h-5 rounded-full bg-white transform translate-x-0"></span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                          In-App Notifications
                        </h4>

                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Quote Updates</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Receive in-app notifications for quote activities
                              </p>
                            </div>
                            <div className="relative inline-block w-10 h-5 rounded-full bg-emerald-500">
                              <input type="checkbox" className="sr-only" checked />
                              <span className="absolute inset-y-0 right-0 w-5 h-5 rounded-full bg-white transform translate-x-0"></span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Invoice Updates</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Receive in-app notifications for invoice activities
                              </p>
                            </div>
                            <div className="relative inline-block w-10 h-5 rounded-full bg-emerald-500">
                              <input type="checkbox" className="sr-only" checked />
                              <span className="absolute inset-y-0 right-0 w-5 h-5 rounded-full bg-white transform translate-x-0"></span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Customer Updates</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Receive in-app notifications for customer activities
                              </p>
                            </div>
                            <div className="relative inline-block w-10 h-5 rounded-full bg-emerald-500">
                              <input type="checkbox" className="sr-only" checked />
                              <span className="absolute inset-y-0 right-0 w-5 h-5 rounded-full bg-white transform translate-x-0"></span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">System Updates</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Receive in-app notifications for system updates
                              </p>
                            </div>
                            <div className="relative inline-block w-10 h-5 rounded-full bg-emerald-500">
                              <input type="checkbox" className="sr-only" checked />
                              <span className="absolute inset-y-0 right-0 w-5 h-5 rounded-full bg-white transform translate-x-0"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "appearance" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance Settings</h3>

                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">Theme</h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div
                            className={`border-2 ${darkMode ? "border-gray-300 dark:border-gray-600" : "border-emerald-500 dark:border-emerald-400"} rounded-lg p-4 cursor-pointer`}
                            onClick={() => setDarkMode(false)}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">Light</span>
                              {!darkMode && <Check size={16} className="text-emerald-500 dark:text-emerald-400" />}
                            </div>
                            <div className="h-20 bg-white border border-gray-200 rounded-md"></div>
                          </div>

                          <div
                            className={`border-2 ${darkMode ? "border-emerald-500 dark:border-emerald-400" : "border-gray-300 dark:border-gray-600"} rounded-lg p-4 cursor-pointer`}
                            onClick={() => setDarkMode(true)}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">Dark</span>
                              {darkMode && <Check size={16} className="text-emerald-500 dark:text-emerald-400" />}
                            </div>
                            <div className="h-20 bg-gray-900 border border-gray-700 rounded-md"></div>
                          </div>

                          <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 cursor-pointer">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">System</span>
                            </div>
                            <div className="h-20 bg-gradient-to-r from-white to-gray-900 border border-gray-200 dark:border-gray-700 rounded-md"></div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">Accent Color</h4>

                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                          <div className="border-2 border-emerald-500 dark:border-emerald-400 rounded-lg p-2 cursor-pointer">
                            <div className="h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-md"></div>
                          </div>

                          <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-2 cursor-pointer">
                            <div className="h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md"></div>
                          </div>

                          <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-2 cursor-pointer">
                            <div className="h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-md"></div>
                          </div>

                          <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-2 cursor-pointer">
                            <div className="h-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-md"></div>
                          </div>

                          <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-2 cursor-pointer">
                            <div className="h-8 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-md"></div>
                          </div>

                          <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-2 cursor-pointer">
                            <div className="h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-md"></div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-base font-medium text-gray-900 dark:text-white">Compact Mode</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Reduce spacing and padding throughout the interface
                            </p>
                          </div>
                          <div className="relative inline-block w-10 h-5 rounded-full bg-gray-300 dark:bg-gray-600">
                            <input type="checkbox" className="sr-only" />
                            <span className="absolute inset-y-0 left-0 w-5 h-5 rounded-full bg-white transform translate-x-0"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "connected" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connected Accounts</h3>

                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                              <Github size={20} className="text-gray-900 dark:text-gray-100" />
                            </div>
                            <div>
                              <h4 className="text-base font-medium text-gray-900 dark:text-white">GitHub</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Not connected</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                            Connect
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                              <Twitter size={20} className="text-blue-500 dark:text-blue-400" />
                            </div>
                            <div>
                              <h4 className="text-base font-medium text-gray-900 dark:text-white">Twitter</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Connected as @alexjohnson</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                            Disconnect
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                              <Linkedin size={20} className="text-blue-700 dark:text-blue-500" />
                            </div>
                            <div>
                              <h4 className="text-base font-medium text-gray-900 dark:text-white">LinkedIn</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Not connected</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                            Connect
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                              <Facebook size={20} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h4 className="text-base font-medium text-gray-900 dark:text-white">Facebook</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Not connected</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                            Connect
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                              <Slack size={20} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <h4 className="text-base font-medium text-gray-900 dark:text-white">Slack</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Connected to QuoteFlow workspace
                              </p>
                            </div>
                          </div>
                          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                            Disconnect
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Sidebar Navigation Item
function NavItem({ icon, text, isOpen, isActive, badge }) {
  return (
    <div
      className={`flex items-center ${isOpen ? "justify-start" : "justify-center"} p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive
          ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
      }`}
    >
      <div className={`${isActive ? "text-emerald-600 dark:text-emerald-400" : ""}`}>{icon}</div>
      {isOpen && (
        <div className="ml-3 flex-1 flex items-center justify-between">
          <span className={`font-medium ${isActive ? "text-emerald-600 dark:text-emerald-400" : ""}`}>{text}</span>
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
  )
}

