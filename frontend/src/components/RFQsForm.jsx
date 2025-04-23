import { useState } from "react";
import InputBox from "./InputBox";

import axios from "axios";

const BASE_URL = "http://localhost:3000/api/v1/RFQS";

export default function RFQForm() {
  const [rfqData, setRfqData] = useState({
    companyName: "",
    name: "",  
    email: "",
    phoneNumber: "", 
    serviceRequired: "",  
    projectDescription: "",  
    estimatedBudget: "",  
    deadline: "",
    additionalNotes: "",
    file: null,
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRfqData({ ...rfqData, [name]: value });
    // Clear any previous error messages when user starts typing
    setError("");
  };

  const handleFileChange = (e) => {
    setRfqData({ ...rfqData, file: e.target.files[0] || null });
  };

  // Validate required fields
  const validateForm = () => {
    // Update required field names to match backend expectations
    const requiredFields = ['companyName', 'name', 'email', 'phoneNumber', 'serviceRequired', 'projectDescription', 'deadline'];
    const missingFields = requiredFields.filter(field => !rfqData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError("");
    
    // Create a new object without the file for JSON submission
    const dataToSubmit = { ...rfqData };
    
    // Remove the file property if it's null or not needed in the API
    if (!dataToSubmit.file) {
      delete dataToSubmit.file;
    }

    try {
      const token = localStorage.getItem("token");
    
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.post(`${BASE_URL}/submitRfq`, rfqData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
      console.log("Success", response);
      
      // Reset form after successful submission
      setRfqData({
        companyName: "",
        name: "",
        email: "",
        phoneNumber: "",
        serviceRequired: "",
        projectDescription: "",
        estimatedBudget: "",
        deadline: "",
        additionalNotes: "",
        file: null,
      });
      
      setSuccess(true);
    } catch (error) {
      console.error("Error submitting RFQ:", error);
      setError(error.response?.data?.msg || "Failed to submit RFQ. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-white text-black dark:bg-[#1b263b] dark:text-white rounded-lg shadow-lg max-w-3xl mx-auto mt-10">
      <h2 className="text-3xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent text-center">
        Request for Quotation (RFQ)
      </h2>
      <p className="text-gray-400 text-center text-sm mb-4">
        Provide your details and project requirements for a custom quotation.
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">Your RFQ has been submitted successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        {/* Company & Personal Details */}
        <InputBox
          title="Company Name *"
          placeholder="Enter your company Name"
          type="text"
          name="companyName"
          value={rfqData.companyName}
          onChange={handleChange}
          required
        />

        <InputBox
          title="Name"
          placeholder="Enter your Name"
          type="text"
          name="name"
          value={rfqData.name}
          onChange={handleChange}
          required
        />

        <InputBox
          title="Email *"
          placeholder="Enter your Email"
          type="email"
          name="email"
          value={rfqData.email}
          onChange={handleChange}
          required
        />

        <InputBox
          title="Phone Number *"
          placeholder="Enter your Contact Number"
          type="tel"
          name="phoneNumber"  
          value={rfqData.phoneNumber}
          onChange={handleChange}
          required
        />

        <InputBox
          title="Service Required *"
          placeholder="eg. Web Development, App Development, UI/UX Design"
          type="text"
          name="serviceRequired"  
          value={rfqData.serviceRequired}
          onChange={handleChange}
          required
        />

        <label
          htmlFor="projectDescription"
          className="block text-sm text-gray-900 dark:text-white"
        >
          Project Description *
        </label>
        <textarea
          id="projectDescription"
          rows="4"
          name="projectDescription"  
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500 resize-none"
          placeholder="Describe your project requirements in detail..."
          value={rfqData.projectDescription}
          onChange={handleChange}
          required
        ></textarea>

        {/* File Upload - Optional */}
        <div>
          <p className="mb-1 text-sm text-gray-900 dark:text-white">
            Upload Supporting File (Optional)
          </p>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 focus:outline-none"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <InputBox
              title="Estimated Budget"
              placeholder="Estimated Budget"
              type="text"
              name="estimatedBudget"
              value={rfqData.estimatedBudget}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <InputBox
              title="Deadline *"
              type="date"
              name="deadline"
              value={rfqData.deadline}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Additional Notes */}
        <label
          htmlFor="additionalNotes"
          className="block text-sm text-gray-900 dark:text-white"
        >
          Additional Notes
        </label>
        <textarea
          id="additionalNotes"
          rows="4"
          name="additionalNotes"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500 resize-none"
          placeholder="Any additional details or special requirements..."
          value={rfqData.additionalNotes}
          onChange={handleChange}
        ></textarea>

        {/* Submit Button */}
        <button
          type="submit"
          className="p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit RFQ"}
        </button>
      </form>
    </div>
  );
}