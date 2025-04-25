"use client"

import { useState } from "react"
import { Bell, Search, Moon, Sun, User, Settings, HelpCircle, Menu } from "lucide-react"
import { getUserFromToken } from "../services/GetUserFromToken"

const Topbar = ({ role }) => {
  const [darkMode, setDarkMode] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    // In a real app, you would toggle a class on the html/body element
    // or use a context to manage the theme
    document.documentElement.classList.toggle("dark")
  }

  const response = getUserFromToken();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6">
      {/* Left: Title and mobile menu */}
      <div className="flex items-center">
        <button className="lg:hidden mr-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white capitalize">{role} Dashboard</h1>
      </div>

      {/* Right: Search, notifications, theme toggle, user menu */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-1"
          >
            <Search size={20} />
          </button>
          {searchOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-1 relative"
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Notifications</h3>
                <button className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
                  Mark all as read
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-2 rounded-full">
                      <Bell size={16} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">New quotation request</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Client ABC has requested a new quotation
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-full">
                      <User size={16} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">New client registered</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        XYZ Corp has created a new account
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">5 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-750">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 p-2 rounded-full">
                      <Settings size={16} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">System update</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        The system will be updated tonight at 2 AM
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full px-4 py-2 text-xs text-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-1"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Help */}
        <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-1">
          <HelpCircle size={20} />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold">
              {response.name.substr(0,1)}
            </div>
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {response.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {response.email}
                </p>
              </div>
              <a
                href="/dashboard/employee/profile"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Your Profile
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Settings
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Sign out
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topbar

