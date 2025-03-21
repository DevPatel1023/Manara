import React, { useState } from "react";
import { Bell, Moon, Sun } from "lucide-react";
import P3 from "../assets/Images/P3.jpg"

const Header = ({profileimg}) => {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <div>
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            Profile Settings
          </h1>

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
              <img
                src={P3 || profileimg}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
