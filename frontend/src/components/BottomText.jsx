import React from "react";
import { Link } from "react-router-dom";

const BottomText = ({ text, to, title }) => {
  return (
    <div className="mt-4 flex items-center justify-center space-x-2">
      <p className="text-gray-700 dark:text-white">{text}</p>
      <Link 
        to={to} 
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:underline transition-colors duration-300"
      >
        {title}
      </Link>
    </div>
  );
};

export default BottomText;