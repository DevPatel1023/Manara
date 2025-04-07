"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  Home,
  Users,
  FileText,
  ClipboardList,
  CreditCard,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  BarChart2,
  Calendar,
  ReceiptText,
  MessageSquare,
} from "lucide-react"

const Sidebar = ({ role = "client" }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(true)
  const [activeSubmenu, setActiveSubmenu] = useState(null)

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/signin")
  }

  const getNavItems = () => {
    const commonItems = [
      {
        name: "Dashboard",
        icon: <Home size={20} />,
        path: `/dashboard/${role}`,
      },
      {
        name: "Settings",
        icon: <Settings size={20} />,
        path: `/dashboard/${role}/settings`,
      },
    ]

    const adminItems = [
      ...commonItems,
      {
        name: "RFQs",
        icon: <FileText size={20} />,
        path: "/dashboard/admin/rfq",
      },
      {
        name: "Quotations",
        icon: <ClipboardList size={20} />,
        path: "/dashboard/admin/quotations",
      },
      {
        name: "Invoices",
        icon: <CreditCard size={20} />,
        path: "/dashboard/admin/invoices",
      },
      {
        name: "Customers",
        icon: <Users size={20} />,
        path: "/dashboard/admin/customers",
      },
      {
        name: "Reports",
        icon: <BarChart2 size={20} />,
        path: "/dashboard/admin/reports",
        submenu: [
          { name: "Sales", path: "/dashboard/admin/reports/sales" },
          { name: "Customers", path: "/dashboard/admin/reports/customers" },
          { name: "Revenue", path: "/dashboard/admin/reports/revenue" },
        ],
      },
      {
        name: "Employees",
        icon: <Users size={20} />,
        path: "/dashboard/admin/employees",
      },
    ]

    const clientItems = [
      ...commonItems,
      {
        name: "RFQs",
        icon: <FileText size={20} />,
        path: "/dashboard/client/rfq",
      },
      {
        name: "Quotations",
        icon: <ClipboardList size={20} />,
        path: "/dashboard/client/quotations",
      },
      {
        name: "PO",
        icon: <ReceiptText size={20} />,
        path: "/dashboard/client/po",
      },
      {
        name: "Invoices",
        icon: <CreditCard size={20} />,
        path: "/dashboard/client/invoices",
      },
    ]

    const employeeItems = [
      ...commonItems,
      {
        name: "Quotation",
        icon: <ClipboardList size={20} />,
        path: "/dashboard/employee/quotationform",
      },
      {
        name: "View RFQs",
        icon: <ClipboardList size={20} />,
        path: "/dashboard/employee/rfq",
      },
      {
        name: "Calendar",
        icon: <Calendar size={20} />,
        path: "/dashboard/employee/calendar",
      },
      {
        name: "Messages",
        icon: <MessageSquare size={20} />,
        path: "/dashboard/employee/messages",
      },
      {
        name: "Customers",
        icon: <Users size={20} />,
        path: "/dashboard/employee/customers",
      },
    ]

    switch (role) {
      case "admin":
        return adminItems
      case "employee":
        return employeeItems
      case "client":
      default:
        return clientItems
    }
  }

  const navItems = getNavItems()

  return (
    <div
      className={`${
        expanded ? "w-64" : "w-20"
      } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out flex flex-col h-full`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between h-16 border-b border-gray-200 dark:border-gray-700">
        {expanded ? (
          <h1 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Dashboard</h1>
        ) : (
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
            D
          </div>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-600 dark:text-gray-300 focus:outline-none"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => (
            <div key={item.name}>
              {item.submenu ? (
                <div className="mb-1">
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className={`${
                      location.pathname.startsWith(item.path)
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    } group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {expanded && (
                      <>
                        <span className="flex-1">{item.name}</span>
                        {activeSubmenu === item.name ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </>
                    )}
                  </button>
                  {expanded && activeSubmenu === item.name && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          to={subitem.path}
                          className={`${
                            location.pathname === subitem.path
                              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`${
                    location.pathname === item.path
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors duration-200`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {expanded && <span>{item.name}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Profile & Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Link to={`/dashboard/${role}/profile`}>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold">
              {role === "admin" ? "A" : role === "employee" ? "E" : "C"}
            </div>
            {expanded && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {role === "admin" ? "Admin User" : role === "employee" ? "Employee User" : "Client User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role}</p>
              </div>
            )}
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className={`mt-4 ${
            expanded ? "w-full" : "w-full justify-center"
          } flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200`}
        >
          <LogOut size={20} className="mr-2" />
          {expanded && <span>Logout</span>}
        </button>
      </div>
    </div>
  )
}

export default Sidebar
