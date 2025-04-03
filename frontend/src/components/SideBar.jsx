"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Home, Users, ClipboardList, FileText, Settings, Menu, X, FileCheck, CreditCard, User } from "lucide-react"

const Sidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(true)
  const location = useLocation()

  // Define navigation items based on role
  const getNavItems = () => {
    const commonItems = [
      { icon: Home, text: "Dashboard", path: "/dashboard" },
      { icon: ClipboardList, text: "Quotations", path: "/quotation" },
      { icon: FileCheck, text: "RFQs", path: "/rfq" },
      { icon: FileText, text: "Invoices", path: "/invoice" },
    ]

    // Admin-specific items
    if (role === "admin") {
      return [
        ...commonItems,
        { icon: Users, text: "Customers", path: "/customers" },
        { icon: Settings, text: "Settings", path: "/settings" },
      ]
    }

    // Client-specific items
    return [
      ...commonItems,
      { icon: User, text: "Profile", path: "/userprofile" },
      { icon: CreditCard, text: "Payments", path: "/payments" },
    ]
  }

  const navItems = getNavItems()

  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow-lg ${
        isOpen ? "w-64" : "w-20"
      } transition-all duration-300 z-20 border-r border-gray-200 dark:border-gray-700 relative h-screen`}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        {isOpen ? (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl">
             <Link to="/"> Q </Link>
            </div>
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              <Link to="/"> QuoteFlow</Link>
            </span>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl mx-auto">
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
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              icon={<item.icon size={20} />}
              text={item.text}
              path={item.path}
              isOpen={isOpen}
              isActive={location.pathname === item.path}
            />
          ))}
        </nav>
      </div>

      {isOpen && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <Link to="/userProfile"> 
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
             <img src="/placeholder.svg?height=40&width=40" alt="Profile" className="w-full h-full object-cover" />
          </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {role === "admin" ? "Admin User" : "Client User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {role === "admin" ? "Administrator" : "Client"}
              </p>
            </div>
          </div>
          </Link> 
        </div>
      )}
    </div>
  )
}

// Sidebar Navigation Item
const NavItem = ({ icon, text, path, isOpen, isActive }) => {
  return (
    <Link
      to={path}
      className={`flex items-center ${isOpen ? "justify-start" : "justify-center"} p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive
          ? "bg-blue-50 dark:bg-blue-900/20 text-emerald-600 dark:text-emerald-400"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
      }`}
    >
      <div className={`${isActive ? "text-emerald-600 dark:text-emerald-400" : ""}`}>{icon}</div>
      {isOpen && (
        <span className={`ml-3 font-medium ${isActive ? "text-emerald-600 dark:text-emerald-400" : ""}`}>{text}</span>
      )}
    </Link>
  )
}

export default Sidebar

