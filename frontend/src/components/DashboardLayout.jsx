"use client"

import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Sidebar from "./SideBar"
import Topbar from "./TopBar"

const DashboardLayout = ({ role, children, title }) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Function to set a default title if prop is not provided
  const getDefaultTitle = (pathname) => {
    switch (pathname) {
      case "/rfq":
        return "Your RFQs";
      case "/profile":
        return "User Profile";
      case "/settings":
        return "Settings";
      default:
        return "Dashboard"; // Default title for unknown routes
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/signin")
    }
  }, [navigate])

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role={role} />
      <div className="flex-1 overflow-auto">
        {/* ✅ Use `title` prop if available, otherwise fallback to `getDefaultTitle` */}
        <Topbar title={title || getDefaultTitle(location.pathname)} />
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export default DashboardLayout;
