import React, { useState } from "react";
import { Link, NavLink } from "react-router";
import { Menu, X, Home, Settings } from "lucide-react";
import {
  Users,
  ClipboardList,
  FileText,
  Bell,

} from "lucide-react";
import P3 from "../assets/Images/P3.jpg"

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" >
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
            <NavLink to="/dashboard">
              <NavItem
                icon={<Home size={20} />}
                text="Dashboard"
                isOpen={isOpen}
                isActive={true}
              />
            </NavLink>
            <NavLink to="/customers">
              <NavItem
                icon={<Users size={20} />}
                text="Customers"
                isOpen={isOpen}
              />
            </NavLink>
            <NavLink to="/quotation">
              <NavItem
                icon={<ClipboardList size={20} />}
                text="Quotations"
                isOpen={isOpen}
              />
            </NavLink>
            <NavLink to="/invoice">
              <NavItem
                icon={<FileText size={20} />}
                text="Invoices"
                isOpen={isOpen}
              />
            </NavLink>
            <NavItem
              icon={<Bell size={20} />}
              text="Notifications"
              isOpen={isOpen}
              badge="5"
            />
            <NavItem
              icon={<Settings size={20} />}
              text="Settings"
              isOpen={isOpen}
            />
          </nav>
        </div>

        {isOpen && (
          <Link to="/userprofile" >
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <img
                  src={P3}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Alex Johnson</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Administrator
                </p>
              </div>
            </div>
          </div>
          </Link>)}
      </div>
    </div>
    
  );
};

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
export default SideBar;
