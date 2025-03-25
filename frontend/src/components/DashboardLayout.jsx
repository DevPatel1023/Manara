"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "./SideBar"
import Topbar from "./TopBar"

const DashboardLayout = ({ role, children }) => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/signin") // Redirect if not logged in
    }
  }, [navigate])

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar role={role} /> {/* Dynamically render sidebar based on role */}
      <div className="flex-1 overflow-auto">
        <Topbar role={role} />
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export default DashboardLayout;

