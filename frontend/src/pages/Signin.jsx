import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import Heading from '../components/Heading';
import SubHeading from '../components/SubHeading';
import InputBox from '../components/InputBox';
import Button from '../components/Button';
import BottomText from '../components/BottomText';

const Signin = () => {
  const navigate = useNavigate();
  const [formValue,setFormValue] = useState({
    email : "",
    password : "",
  });
  const [error,setError] = useState("");

  const handleChange = (e) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value,
    });
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission
    setError('');  // Clear any existing errors
  
    try {
      // Log the form values for verification
      console.log("Submitting form with values:", formValue);

      const response = await axios.post("http://localhost:3000/api/v1/users/signin", formValue);

      // Log the response to ensure we get the token
      console.log("Response data:", response.data);

      if (response.data.token) {
        // Store token in localStorage after successful login
        localStorage.setItem('token', response.data.token);

        console.log("Navigating to dashboard..."); // Check if this logs
        navigate("/dashboard");  // Navigate to dashboard after successful login
      } else {
        setError("Login failed! Please try again.");
      }
    } catch (error) {
      // Log the error to inspect it
      console.error("Error during login:", error);
      setError(error?.response?.data?.message || "An error occurred");
    }
};


  return (
    <div className='flex justify-center items-center h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef]'>
      <div className='w-auto p-10 rounded-xl bg-white/20 backdrop-blur-lg border border-white/40 shadow-lg flex flex-col justify-center items-center'>
        <Heading title="Sign In" style="text-4xl text-[#1e2022] font-bold" />
        <SubHeading subtitle="Enter your information and login into account"/>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <InputBox 
        title="Email" 
        type="text" 
        name="email" 
        placeholder="jhondoe123@example.com" 
        value={formValue.email} 
        onChange={handleChange}/>

        <InputBox 
        title="Password" 
        type="text" 
        name="password" 
        placeholder="********" 
        value={formValue.password} 
        onChange={handleChange}/>

        <Button title="Submit" onClick={handleSubmit} style='bg-[#009e74] text-center text-white rounded-md hover:bg-[#008e68] mt-5 w-full mb-3 p-3'/>
        <BottomText text="don't have an account? create one" to="/signup" title="sign up" />
      </div>
      
    </div>
  )
}

export default Signin;
