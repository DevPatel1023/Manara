import React from "react";
import Button from "./Button";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/ThemeContext"; 
import { Moon, Sun } from "lucide-react";

const TopBar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="sticky top-0 left-0 w-full bg-white/30 dark:bg-[#25282a] shadow-md z-50 mb-3 backdrop-blur-md ">
      <div className="flex justify-end gap-4 px-5 py-3">
        <button onClick={toggleTheme} className="text-gray-600 dark:text-white">
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <Link to="/signup">
          <Button
            title="Sign Up"
            style="text-center text-gray-500 dark:text-white rounded-md hover:text-gray-600 hover:shadow-[#008e68] p-3 cursor-pointer"
          />
        </Link>

        <Link to="/signin">
          <Button
            title="Sign In"
            style="bg-[#009e74] text-white rounded-md hover:bg-[#008e68] shadow-md shadow-[#008e68]/30 hover:shadow-[#008e68]/70 p-3 cursor-pointer"
          />
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
