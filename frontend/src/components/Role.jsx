import React, { useState } from 'react';
import axios from "axios";

const Role = ({onRoleChange}) => {
  const [role, setRole] = useState("client");

  const handleSwitch = () => {
    const newRole = role === "admin" ? "client" : "admin";
    setRole(newRole);
    onRoleChange(newRole);  // Send role back to Signin component
  };

  return (
    <div className='flex items-center justify-center my-5'>
      <div 
        className={`relative w-32 h-10 bg-white/30 backdrop-blur-md border border-white/40 rounded-full shadow-md cursor-pointer`}
        onClick={handleSwitch}
      >
        <div 
          className={`absolute top-1 bottom-1 ${role === "admin" ? "left-1" : "right-1"} 
            w-14 bg-[#009e74] rounded-full transition-all duration-300`}
        />
        <div className={`absolute top-2 left-3 text-sm font-semibold ${role === "admin" ? "text-white" : "text-[#1e2022]"}`}>
          Admin
        </div>
        <div className={`absolute top-2 right-3 text-sm font-semibold ${role === "client" ? "text-white" : "text-[#1e2022]"}`}>
          Client
        </div>
      </div>
    </div>
  );
};

export default Role;
  