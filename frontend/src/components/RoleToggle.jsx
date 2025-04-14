import React from "react";

const RoleToggle = ({ selectedRole, onChange }) => {
  const roles = ["client", "employee", "admin"];

  return (
    <div className="flex justify-center w-full mt-6 mb-6">
      <div className="inline-flex rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 shadow-sm">
        {roles.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => onChange(role)}
            className={`py-1 px-4 text-sm capitalize transition-colors ${
              selectedRole === role
                ? "bg-[#009e74] text-white"
                : "bg-white dark:bg-[#1e2022] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2d30]"
            }`}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleToggle;