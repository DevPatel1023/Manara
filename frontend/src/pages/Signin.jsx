import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import BottomText from "../components/BottomText";
import RoleToggle from "../components/RoleToggle";

const Signin = () => {
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
    role: "client", // Default to client role
    accessId: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (role) => {
    setFormValue({
      ...formValue,
      role: role,
      // Clear accessId when switching to client role
      accessId: role === "client" ? "" : formValue.accessId
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("SIGNIN ATTEMPT - Form data:", JSON.stringify(formValue, null, 2)); 
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/signin",
        formValue
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        setError("Login failed! Please try again.");
      }
    } catch (error) {
      setError(error?.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] dark:from-[#1a1c1e] dark:to-[#121314]">
      <div className="w-auto p-10 rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur-lg border border-white/40 shadow-lg flex flex-col justify-center items-center">
        <Heading title="Sign In" style="text-4xl text-[#1e2022] dark:text-white font-bold" />
        <SubHeading subtitle="Enter your information and login into account" className="text-gray-600 dark:text-gray-300" />
        
        {/* Role Toggle Button - Right after heading/subheading */}
        <RoleToggle selectedRole={formValue.role} onChange={handleRoleChange} />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <InputBox
          title="Email"
          type="text"
          name="email"
          placeholder="jhondoe123@example.com"
          value={formValue.email}
          onChange={handleChange}
        />

        <InputBox
          title="Password"
          type="password"
          name="password"
          placeholder="********"
          value={formValue.password}
          onChange={handleChange}
        />

        {(formValue.role === "admin" || formValue.role === "employee") && (
          <InputBox
            title="AccessId"
            type="text"
            name="accessId"
            placeholder="********"
            value={formValue.accessId}
            onChange={handleChange}
          />
        )}

        <Button
          title="Submit"
          onClick={handleSubmit}
          style="bg-[#009e74] text-center text-white rounded-md hover:bg-[#008e68] mt-5 w-full mb-3 p-3"
        />

        <BottomText
          text="Don't have an account? Create one"
          to="/signup"
          title="Sign up"
          className="text-gray-600 dark:text-gray-300"
        />
      </div>
    </div>
  );
};

export default Signin;