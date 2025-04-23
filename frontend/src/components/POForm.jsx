"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const POForm = () => {
  const [formData, setFormData] = useState({
    quotationId: "",
    poNumber: "",
    date: "",
    deliveryDate: "",
    billTo: {
      company: "",
      address: "",
      cityState: "",
      postalCode: "",
      phone: "",
      email: "",
    },
    services: [{ description: "", hours: "", ratePerHour: "", amount: 0 }],
    taxRate: "",
    notes: "",
  });

  const [quotations, setQuotations] = useState([]);
  const [loadingQuotations, setLoadingQuotations] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuotation, setSearchQuotation] = useState("");

  // Fetch quotations on component mount
  useEffect(() => {
    fetchQuotations();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.quotation-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchQuotations = async () => {
    try {
      setLoadingQuotations(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/v1/quotations/client", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuotations(res.data);
      setLoadingQuotations(false);
    } catch (err) {
      console.error("Error fetching quotations:", err);
      setLoadingQuotations(false);
    }
  };

  // Handle quotation selection from dropdown
  const handleQuotationSelect = (quotation) => {
    // Update quotation ID
    setFormData(prevData => ({
      ...prevData,
      quotationId: quotation._id,
      // Auto-fill billTo fields from quotation
      billTo: {
        company: quotation.billToCompany || "",
        address: quotation.billToAddress || "",
        cityState: quotation.billToCityState || "",
        postalCode: quotation.billToPostalCode || "",
        phone: quotation.billToPhone || "",
        email: quotation.billToEmail || "",
      },
      // Auto-fill tax rate if available
      taxRate: quotation.taxRate?.toString() || "",
      // Auto-fill PO number if available
      poNumber: quotation.poNumber || "",
      // Auto-fill notes if available
      notes: quotation.notes || "",
      // Keep the services empty as requested (don't auto-fill)
      // Keep date and delivery date empty as requested
    }));

    setSearchQuotation(quotation._id);
    setShowDropdown(false);
    setErrors({ ...errors, quotationId: "" });
  };

  // Filter quotations based on search input
  const filteredQuotations = quotations.filter(quotation =>
    quotation._id.toLowerCase().includes(searchQuotation.toLowerCase()) ||
    quotation.poNumber?.toLowerCase().includes(searchQuotation.toLowerCase()) ||
    quotation.billToCompany?.toLowerCase().includes(searchQuotation.toLowerCase())
  );

  const validateField = (name, value) => {
    let error = "";
    if (typeof value === "string" && !value.trim()) {
      if (
        [
          "quotationId",
          "poNumber",
          "date",
          "deliveryDate",
          "billTo.company",
          "billTo.address",
          "billTo.cityState",
          "billTo.postalCode",
          "billTo.phone",
          "billTo.email",
        ].includes(name)
      ) {
        error = `${name.split(".").pop().replace(/([A-Z])/g, " $1")} is required`;
      }
    } else if (name === "taxRate" && value !== "" && Number(value) < 0) {
      error = "Tax rate cannot be negative";
    } else if (name === "quotationId" && value.trim() && !isValidObjectId(value)) {
      error = "Quotation ID must be a valid MongoDB ObjectId (24 hex characters)";
    } else if (name === "billTo.email" && value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = "Please enter a valid email address";
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("billTo.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        billTo: { ...formData.billTo, [field]: value },
      });
      setErrors({
        ...errors,
        [`billTo.${field}`]: validateField(`billTo.${field}`, value),
      });
    } else {
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  };

  const handleServiceChange = (index, field, value) => {
    const newServices = [...formData.services];
    if (field === "description") {
      newServices[index][field] = value;
    } else if (field === "hours" || field === "ratePerHour") {
      newServices[index][field] = value; // Keep as string for input
      const hours = Number(newServices[index].hours) || 0;
      const ratePerHour = Number(newServices[index].ratePerHour) || 0;
      newServices[index].amount = hours * ratePerHour;
    }
    setFormData({ ...formData, services: newServices });
  };

  const addService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { description: "", hours: "", ratePerHour: "", amount: 0 }],
    });
  };

  const removeService = () => {
    if (formData.services.length > 1) {
      setFormData({
        ...formData,
        services: formData.services.slice(0, -1),
      });
    }
  };

  const calculateAmountForService = (hours, ratePerHour) => (Number(hours) || 0) * (Number(ratePerHour) || 0);
  const calculateSubtotal = () => formData.services.reduce((sum, service) => sum + (service.amount || 0), 0);
  const calculateTax = () => (calculateSubtotal() * (Number(formData.taxRate) || 0)) / 100;
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate top-level fields
    ["quotationId", "poNumber", "date", "deliveryDate"].forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    // Validate billTo fields
    Object.keys(formData.billTo).forEach((key) => {
      const error = validateField(`billTo.${key}`, formData.billTo[key]);
      if (error) newErrors[`billTo.${key}`] = error;
    });

    // Validate services
    formData.services.forEach((service, index) => {
      if (!service.description.trim()) {
        newErrors[`serviceDescription${index}`] = "Service description is required";
      }
      if (service.hours === "" || isNaN(Number(service.hours)) || Number(service.hours) < 0) {
        newErrors[`serviceHours${index}`] = "Hours must be a non-negative number";
      }
      if (service.ratePerHour === "" || isNaN(Number(service.ratePerHour)) || Number(service.ratePerHour) < 0) {
        newErrors[`serviceRatePerHour${index}`] = "Rate per hour must be a non-negative number";
      }
    });

    // Validate date comparison
    if (formData.date && formData.deliveryDate) {
      if (new Date(formData.deliveryDate) < new Date(formData.date)) {
        newErrors.deliveryDate = "Delivery date cannot be before PO date";
      }
    }

    // Validate taxRate (optional but must be non-negative if provided)
    if (formData.taxRate !== "" && (isNaN(Number(formData.taxRate)) || Number(formData.taxRate) < 0)) {
      newErrors.taxRate = "Tax rate must be a non-negative number";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrors({ global: "You must be logged in to submit a purchase order" });
        return;
      }

      const submissionData = {
        quotationId: formData.quotationId.trim(),
        poNumber: formData.poNumber.trim(),
        date: new Date(formData.date).toISOString(),
        deliveryDate: new Date(formData.deliveryDate).toISOString(),
        billTo: {
          company: formData.billTo.company.trim(),
          address: formData.billTo.address.trim(),
          cityState: formData.billTo.cityState.trim(),
          postalCode: formData.billTo.postalCode.trim(),
          phone: formData.billTo.phone.trim(),
          email: formData.billTo.email.trim(),
        },
        services: formData.services.map((service) => ({
          description: service.description.trim(),
          hours: Number(service.hours),
          ratePerHour: Number(service.ratePerHour),
        })),
        taxRate: Number(formData.taxRate) || 0,
        notes: formData.notes.trim() || "",
      };

      try {
        setIsLoading(true);
        console.log("Submission Data:", submissionData);

        const response = await axios.post(
          "http://localhost:3000/api/v1/PO/submitpo",
          submissionData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Form submitted successfully:", response.data);
        alert("Purchase Order submitted successfully!");
        setFormData({
          quotationId: "",
          poNumber: "",
          date: "",
          deliveryDate: "",
          billTo: { company: "", address: "", cityState: "", postalCode: "", phone: "", email: "" },
          services: [{ description: "", hours: "", ratePerHour: "", amount: 0 }],
          taxRate: "",
          notes: "",
        });
        setErrors({});
        setSearchQuotation("");
      } catch (error) {
        console.error("Error submitting PO:", error);
        if (error.code === "ERR_NETWORK") {
          setErrors({
            global: "Network error: Could not connect to the server. Please ensure it's running on localhost:3000.",
          });
        } else {
          const errorMessage = error.response?.data?.message || error.message;
          const backendErrors = error.response?.data?.errors || {};
          console.log("Full Server Response:", JSON.stringify(error.response?.data, null, 2));

          const mappedErrors = { global: errorMessage };
          if (errorMessage === "PO number already exists") {
            mappedErrors.poNumber = errorMessage;
          } else if (errorMessage === "Invalid Quotation ID") {
            mappedErrors.quotationId = errorMessage;
          } else if (errorMessage === "Validation error") {
            Object.keys(backendErrors).forEach((key) => {
              if (key.startsWith("billTo.")) {
                mappedErrors[key] = backendErrors[key].message;
              } else if (key.startsWith("services")) {
                const [_, index, field] = key.match(/services\.(\d+)\.(.+)/) || [];
                if (index && field) {
                  mappedErrors[`service${field.charAt(0).toUpperCase() + field.slice(1)}${index}`] =
                    backendErrors[key].message;
                }
              } else {
                mappedErrors[key] = backendErrors[key].message;
              }
            });
          } else if (errorMessage.includes("Unauthorized")) {
            mappedErrors.global = "You must be logged in with client permissions";
          } else if (errorMessage.includes("Forbidden")) {
            mappedErrors.global = "You do not have permission to create a PO";
          }
          setErrors(mappedErrors);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("Form has errors:", newErrors);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full min-h-screen m-0 p-5 dark:bg-[#1b263b] bg-white flex flex-col md:p-3 sm:p-2 text-black dark:text-white"
    >
      {errors.global && (
        <div className="bg-red-600 text-white p-2 mb-5 rounded text-center">{errors.global}</div>
      )}
      <h1
        className="text-black dark:text-white text-4xl font-bold text-center m-0 mb-5 p-2.5 bg-white dark:bg-[#1b263b] relative 
        before:content-['Purchase_Order'] before:absolute before:top-1/2 before:left-1/2 
        before:-translate-x-1/2 before:-translate-y-1/2 before:text-gray-700 before:text-4xl before:-z-10 
        md:text-3xl sm:text-2xl md:before:text-3xl sm:before:text-2xl"
      >
        Purchase Order
      </h1>

      <div className="flex justify-between items-start bg-white dark:bg-[#2e3951] p-4 mb-5 border border-gray-600 rounded-lg shadow-md md:flex-col sm:p-2.5">
        <div className="w-[45%] md:w-full md:mb-2.5">
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col relative quotation-dropdown">
              <label className="font-bold mb-1 text-sm text-black dark:text-white md:text-xs sm:text-[11px]">
                Quotation ID:
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="quotationId"
                  value={searchQuotation}
                  onChange={(e) => {
                    setSearchQuotation(e.target.value);
                    setFormData({ ...formData, quotationId: e.target.value });
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Select or enter quotation ID"
                  className={`p-2 border border-gray-500 rounded w-full text-sm  dark:bg-[#3a4560]  dark:text-white ${errors.quotationId ? "border-red-500" : ""
                    }`}
                  disabled={isLoading}
                />
                {!loadingQuotations && showDropdown && quotations.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 dark:bg-[#3a4560] border border-gray-500 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredQuotations.map((quotation) => (
                      <div
                        key={quotation._id}
                        className="p-2 cursor-pointer hover:bg-[#4a5570] text-sm"
                        onClick={() => handleQuotationSelect(quotation)}
                      >
                        <div className="font-medium text-white">ID: {quotation._id}</div>
                        <div className="text-gray-300 text-xs">
                          PO: {quotation.poNumber || "N/A"} | Company: {quotation.billToCompany || "N/A"}
                        </div>
                      </div>
                    ))}
                    {filteredQuotations.length === 0 && (
                      <div className="p-2 text-gray-400 text-sm">No matching quotations found</div>
                    )}
                  </div>
                )}
              </div>
              {errors.quotationId && <span className="text-red-400 text-xs mt-1">{errors.quotationId}</span>}
              {loadingQuotations && (
                <span className="text-gray-400 text-xs mt-1">Loading quotations...</span>
              )}
              {!loadingQuotations && (
                <span className="text-gray-400 text-xs mt-1">Select from dropdown or enter a valid MongoDB ObjectId</span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right w-auto md:w-full md:text-right">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-end md:justify-start">
              <label className="font-bold mr-1.5 text-sm dark:text-white md:text-xs sm:text-[11px]">
                PO Number:
              </label>
              <div className="flex flex-col items-end md:items-start">
                <div className="flex items-center">
                  <span className="p-1.5 dark:bg-gray-600 border border-r-0   border-gray-500 rounded-l text-sm dark:text-gray-300">
                    PO-
                  </span>
                  <input
                    type="text"
                    name="poNumber"
                    value={formData.poNumber}
                    onChange={handleChange}
                    placeholder="Enter number"
                    className={`p-1.5 border border-gray-500 rounded-r w-[120px] text-sm dark:bg-[#3a4560] dark:text-white ${errors.poNumber ? "border-red-500" : ""
                      }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.poNumber && <span className="text-red-400 text-xs mt-1">{errors.poNumber}</span>}
              </div>
            </div>
            <div className="flex items-center justify-end md:justify-start">
              <label className="font-bold mr-1.5 text-sm dark:text-gray-300 md:text-xs sm:text-[11px]">
                Date:
              </label>
              <div className="flex flex-col items-end md:items-start">
                <div className="flex items-center">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`p-1.5 border border-gray-500 rounded w-[150px] text-sm dark:bg-[#3a4560] dark:text-white ${errors.date ? "border-red-500" : ""
                      }`}
                    disabled={isLoading}
                  />
                  {formData.date && <span className="ml-2 text-sm text-gray-300">{formatDate(formData.date)}</span>}
                </div>
                {errors.date && <span className="text-red-400 text-xs mt-1">{errors.date}</span>}
              </div>
            </div>
            <div className="flex items-center justify-end md:justify-start">
              <label className="font-bold mr-1.5 text-sm dark:text-white md:text-xs sm:text-[11px]">
                Delivery Date:
              </label>
              <div className="flex flex-col items-end md:items-start">
                <div className="flex items-center">
                  <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleChange}
                    className={`p-1.5 border border-gray-500 rounded w-[150px] text-sm dark:bg-[#3a4560] dark:text-white ${errors.deliveryDate ? "border-red-500" : ""
                      }`}
                    disabled={isLoading}
                  />
                  {formData.deliveryDate && (
                    <span className="ml-2 text-sm text-gray-300">{formatDate(formData.deliveryDate)}</span>
                  )}
                </div>
                {errors.deliveryDate && (
                  <span className="text-red-400 text-xs mt-1">{errors.deliveryDate}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dark:bg-[#2e3951] p-4 mb-5 border border-gray-600 rounded-lg shadow-md md:p-2.5 sm:p-2">
        <strong className="text-base dark:text-white block mb-2.5 md:text-sm sm:text-[11px]">Bill To</strong>
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col">
            <label className="font-bold mb-1 text-sm text-gray-300">Company:</label>
            <input
              type="text"
              name="billTo.company"
              value={formData.billTo.company}
              onChange={handleChange}
              placeholder="Enter company name"
              className={`p-2 border border-gray-500 rounded w-full text-sm dark:bg-[#3a4560] dark:text-white ${errors["billTo.company"] ? "border-red-500" : ""
                }`}
              disabled={isLoading}
            />
            {errors["billTo.company"] && (
              <span className="text-red-400 text-xs mt-1">{errors["billTo.company"]}</span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="font-bold mb-1 text-sm text-gray-300">Address:</label>
            <input
              type="text"
              name="billTo.address"
              value={formData.billTo.address}
              onChange={handleChange}
              placeholder="Enter address"
              className={`p-2 border border-gray-500 rounded w-full text-sm bg-[#3a4560] text-white ${errors["billTo.address"] ? "border-red-500" : ""
                }`}
              disabled={isLoading}
            />
            {errors["billTo.address"] && (
              <span className="text-red-400 text-xs mt-1">{errors["billTo.address"]}</span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="font-bold mb-1 text-sm text-gray-300">City/State:</label>
            <input
              type="text"
              name="billTo.cityState"
              value={formData.billTo.cityState}
              onChange={handleChange}
              placeholder="Enter city/state"
              className={`p-2 border border-gray-500 rounded w-full text-sm bg-[#3a4560] text-white ${errors["billTo.cityState"] ? "border-red-500" : ""
                }`}
              disabled={isLoading}
            />
            {errors["billTo.cityState"] && (
              <span className="text-red-400 text-xs mt-1">{errors["billTo.cityState"]}</span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="font-bold mb-1 text-sm text-gray-300">Postal Code:</label>
            <input
              type="text"
              name="billTo.postalCode"
              value={formData.billTo.postalCode}
              onChange={handleChange}
              placeholder="Enter postal code"
              className={`p-2 border border-gray-500 rounded w-full text-sm bg-[#3a4560] text-white ${errors["billTo.postalCode"] ? "border-red-500" : ""
                }`}
              disabled={isLoading}
            />
            {errors["billTo.postalCode"] && (
              <span className="text-red-400 text-xs mt-1">{errors["billTo.postalCode"]}</span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="font-bold mb-1 text-sm text-gray-300">Phone:</label>
            <input
              type="text"
              name="billTo.phone"
              value={formData.billTo.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className={`p-2 border border-gray-500 rounded w-full text-sm bg-[#3a4560] text-white ${errors["billTo.phone"] ? "border-red-500" : ""
                }`}
              disabled={isLoading}
            />
            {errors["billTo.phone"] && (
              <span className="text-red-400 text-xs mt-1">{errors["billTo.phone"]}</span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="font-bold mb-1 text-sm text-gray-300">Email:</label>
            <input
              type="email"
              name="billTo.email"
              value={formData.billTo.email}
              onChange={handleChange}
              placeholder="Enter email"
              className={`p-2 border border-gray-500 rounded w-full text-sm bg-[#3a4560] text-white ${errors["billTo.email"] ? "border-red-500" : ""
                }`}
              disabled={isLoading}
            />
            {errors["billTo.email"] && (
              <span className="text-red-400 text-xs mt-1">{errors["billTo.email"]}</span>
            )}
          </div>
        </div>
      </div>

      <div className="mb-5">
        <table className="w-full border-collapse mb-2.5">
          <thead>
            <tr>
              <th className="border border-gray-600 p-2.5 text-left text-sm font-bold bg-[#2e3951] text-white">
                Description
              </th>
              <th className="border border-gray-600 p-2.5 text-left text-sm font-bold bg-[#2e3951] text-white">
                Hours
              </th>
              <th className="border border-gray-600 p-2.5 text-left text-sm font-bold bg-[#2e3951] text-white">
                Rate/Hour
              </th>
              <th className="border border-gray-600 p-2.5 text-left text-sm font-bold bg-[#2e3951] text-white">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {formData.services.map((service, index) => (
              <tr key={index}>
                <td className="border border-gray-600 p-2.5 bg-[#3a4560]">
                  <input
                    type="text"
                    value={service.description}
                    onChange={(e) => handleServiceChange(index, "description", e.target.value)}
                    placeholder="Enter service description"
                    className={`w-full p-1 border border-gray-500 rounded bg-[#4a5570] text-white ${errors[`serviceDescription${index}`] ? "border-red-500" : ""
                      }`}
                    disabled={isLoading}
                  />
                  {errors[`serviceDescription${index}`] && (
                    <span className="text-red-400 text-xs block mt-1.5">
                      {errors[`serviceDescription${index}`]}
                    </span>
                  )}
                </td>
                <td className="border border-gray-600 p-2.5 bg-[#3a4560]">
                  <input
                    type="number"
                    value={service.hours}
                    onChange={(e) => handleServiceChange(index, "hours", e.target.value)}
                    min="0"
                    step="0.1"
                    placeholder="0"
                    className={`w-full p-1 border border-gray-500 rounded bg-[#4a5570] text-white ${errors[`serviceHours${index}`] ? "border-red-500" : ""
                      }`}
                    disabled={isLoading}
                  />
                  {errors[`serviceHours${index}`] && (
                    <span className="text-red-400 text-xs block mt-1.5">{errors[`serviceHours${index}`]}</span>
                  )}
                </td>
                <td className="border border-gray-600 p-2.5 bg-[#3a4560]">
                  <input
                    type="number"
                    value={service.ratePerHour}
                    onChange={(e) => handleServiceChange(index, "ratePerHour", e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="0"
                    className={`w-full p-1 border border-gray-500 rounded bg-[#4a5570] text-white ${errors[`serviceRatePerHour${index}`] ? "border-red-500" : ""
                      }`}
                    disabled={isLoading}
                  />
                  {errors[`serviceRatePerHour${index}`] && (
                    <span className="text-red-400 text-xs block mt-1.5">
                      {errors[`serviceRatePerHour${index}`]}
                    </span>
                  )}
                </td>
                <td className="border border-gray-600 p-2.5 text-sm text-white bg-[#3a4560]">
                  {service.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center gap-2.5 mt-2.5">
          <button
            type="button"
            onClick={addService}
            className="p-2 px-4 bg-blue-600 text-white border-none rounded text-sm hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Add Service
          </button>
          <button
            type="button"
            onClick={removeService}
            disabled={formData.services.length === 1 || isLoading}
            className="p-2 px-4 bg-[#2e3951] text-gray-300 border border-gray-600 rounded text-sm hover:bg-[#3a4560] disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Remove Service
          </button>
        </div>
      </div>

      <div className="bg-[#2e3951] p-4 mb-5 border border-gray-600 rounded-lg shadow-md flex flex-col">
        <p className="m-1.5 text-sm text-gray-300">Subtotal: {calculateSubtotal().toFixed(2)}</p>
        <div className="mb-2.5">
          <label className="font-bold mr-2.5 text-gray-300">Tax Rate (%):</label>
          <input
            type="number"
            name="taxRate"
            value={formData.taxRate}
            onChange={handleChange}
            min="0"
            step="0.1"
            placeholder="Enter tax rate"
            className={`p-1.5 border border-gray-500 rounded w-[100px] text-sm bg-[#3a4560] text-white ${errors.taxRate ? "border-red-500" : ""
              }`}
            disabled={isLoading}
          />
          {errors.taxRate && <span className="text-red-400 text-xs block mt-1.5">{errors.taxRate}</span>}
        </div>
        <p className="m-1.5 text-sm text-gray-300">Tax: {calculateTax().toFixed(2)}</p>
        <p className="m-1.5 text-sm font-bold text-white">Total: {calculateTotal().toFixed(2)}</p>
      </div>

      <div className="bg-[#2e3951] p-4 mb-5 border border-gray-600 rounded-lg shadow-md">
        <label className="block font-bold mb-2.5 text-gray-300">Notes:</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Enter any additional notes"
          className="p-2 border border-gray-500 rounded w-full h-[100px] text-sm bg-[#3a4560] text-white"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        className="p-2.5 px-5 bg-blue-600 text-white border-none rounded text-base w-[200px] mx-auto hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : "Submit PO"}
      </button>
    </form>
  );
};

export default POForm;