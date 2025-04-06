"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from "axios";

const QuotationForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    companyName: 'TECH ELECON PVT. LTD',
    address: 'Anand Sojitra Road',
    cityState: 'Vallabh Vidyanagar, Gujarat',
    postalCode: '388120',
    email: 'inquiry@techelecon.com',
    billToCompany: '',
    billToAddress: '',
    billToCityState: '',
    billToPostalCode: '',
    poNumber: '',
    date: '',
    deliveryDate: '',
    services: [{ description: '', hours: 0, ratePerHour: 0, amount: 0 }],
    taxRate: 0,
    notes: '',
    paymentTerms: '50% Advance, Remaining on Completion',
    paymentMode: 'Bank Transfer',
    // completionDate: '',
    customPaymentTerms: '',
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'billToCompany':
        if (!value.trim()) error = 'Company name is required';
        break;
      case 'billToAddress':
        if (!value.trim()) error = 'Address is required';
        break;
      case 'billToCityState':
        if (!value.trim()) error = 'City/State is required';
        break;
      case 'billToPostalCode':
        if (!value.trim()) error = 'Postal code is required';
        break;
      case 'poNumber':
        if (!value.trim()) error = 'Quote number is required';
        break;
      case 'date':
      case 'deliveryDate':
      // case 'completionDate':
      //   if (!value) error = 'Date is required';
      //   break;
      case 'taxRate':
        if (value < 0) error = 'Tax rate cannot be negative';
        break;
      case 'customPaymentTerms':
        if (formData.paymentTerms === 'Custom' && !value.trim())
          error = 'Custom payment terms are required';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handlePaymentTermsChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      paymentTerms: value,
      customPaymentTerms: value === 'Custom' ? '' : formData.customPaymentTerms,
    });
    const error = validateField('paymentTerms', value);
    setErrors({ ...errors, paymentTerms: error });
  };

  const handlePaymentModeChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, paymentMode: value });
    const error = validateField('paymentMode', value);
    setErrors({ ...errors, paymentMode: error });
  };

  const handleServiceChange = (index, field, value) => {
    const newServices = [...formData.services];
    if (field === 'description') {
      newServices[index][field] = value;
    } else if (field === 'hours' || field === 'ratePerHour') {
      newServices[index][field] = parseFloat(value) || 0;
      newServices[index].amount = calculateAmount(newServices[index].hours, newServices[index].ratePerHour);
    }
    setFormData({ ...formData, services: newServices });
  };

  const addService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { description: '', hours: 0, ratePerHour: 0, amount: 0 }],
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

  const calculateAmount = (hours, ratePerHour) => hours * ratePerHour;
  const calculateSubtotal = () => formData.services.reduce((sum, service) => sum + service.amount, 0);
  const calculateTax = () => (calculateSubtotal() * formData.taxRate) / 100;
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  // import axios from "axios";

const handleSubmit = async (e) => {
  e.preventDefault();
  let newErrors = {};

  // Validate main fields
  Object.keys(formData).forEach((key) => {
    if (key !== "services" && key !== "notes") {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    }
  });

  // Validate services array
  formData.services.forEach((service, index) => {
    if (!service.description.trim()) {
      newErrors[`serviceDescription${index}`] = "Service description is required";
    }
    if (service.hours <= 0) {
      newErrors[`serviceHours${index}`] = "Hours must be greater than 0";
    }
    if (service.ratePerHour <= 0) {
      newErrors[`serviceRate${index}`] = "Rate per hour must be greater than 0";
    }
  });

  setErrors(newErrors);

  // If no errors, proceed to API call
  if (Object.keys(newErrors).length === 0) {
    const submissionData = {
      ...formData,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal(),
    };

    try {
      const response = await axios.post("http://localhost:3000/api/v1/quotations/create", submissionData); // update URL if different

      if (response.status === 201) {
        alert("Quotation submitted successfully!");
        console.log("Quotation saved:", response.data);
        if (onClose) onClose(); // if you're closing a modal or something
      }
    } catch (error) {
      console.error("Error submitting quotation:", error.response?.data || error.message);
      alert("Failed to submit quotation. Please try again.");
    }
  } else {
    console.log("Form has errors:", newErrors);
  }
};


  // Common input class for consistent styling
  const inputClass = "p-1.5 border border-green-300 rounded w-full text-sm text-black bg-white focus:outline-none focus:border-green-600 focus:shadow-[0_0_5px_rgba(22,163,74,0.3)]";
  const labelClass = "font-bold text-sm text-gray-700";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <div className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-emerald-700">New Quotation</h1>
        {onClose && (
          <button 
            type="button" 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="w-full m-0 p-5 font-sans bg-white dark:bg-gray-800 box-border flex flex-col md:p-3 sm:p-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between bg-green-50 dark:bg-green-900/20 p-4 mb-5 border border-green-300 dark:border-green-800 rounded-lg md:flex-col sm:p-2.5">
          <div className="w-[45%] text-left md:w-full md:mb-4">
            <strong className="text-lg block mb-2.5">{formData.companyName}</strong>
            <p className="m-1.5 text-sm">Address: {formData.address}</p>
            <p className="m-1.5 text-sm">City/State: {formData.cityState}</p>
            <p className="m-1.5 text-sm">Postal Code: {formData.postalCode}</p>
            <p className="m-1.5 text-sm">Email Address: {formData.email}</p>
          </div>
          <div className="w-[45%] text-right md:w-full md:text-left">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-end md:justify-start">
                <label className={`${labelClass} w-[150px] text-right md:text-xs sm:text-[11px] sm:w-[120px] sm:text-left dark:text-gray-300`}>Quotation Number:</label>
                <div className="flex flex-col">
                  <input
                    type="text"
                    name="poNumber"
                    value={formData.poNumber}
                    onChange={handleChange}
                    placeholder="Enter Quote number"
                    className={`${inputClass} w-[150px] md:w-[150px] sm:w-full sm:text-[11px] ${errors.poNumber ? 'border-red-500' : ''}`}
                  />
                  {errors.poNumber && <span className={errorClass}>{errors.poNumber}</span>}
                </div>
              </div>
              <div className="flex items-center justify-end md:justify-start">
                <label className={`${labelClass} w-[150px] text-right md:text-xs sm:text-[11px] sm:w-[120px] sm:text-left dark:text-gray-300`}>Date:</label>
                <div className="flex flex-col">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`${inputClass} w-[150px] md:w-[150px] sm:w-full sm:text-[11px] ${errors.date ? 'border-red-500' : ''}`}
                  />
                  {errors.date && <span className={errorClass}>{errors.date}</span>}
                </div>
              </div>
              <div className="flex items-center justify-end md:justify-start">
                <label className={`${labelClass} w-[150px] text-right md:text-xs sm:text-[11px] sm:w-[120px] sm:text-left dark:text-gray-300`}>Delivery Date:</label>
                <div className="flex flex-col">
                  <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleChange}
                    className={`${inputClass} w-[150px] md:w-[150px] sm:w-full sm:text-[11px] ${errors.deliveryDate ? 'border-red-500' : ''}`}
                  />
                  {errors.deliveryDate && <span className={errorClass}>{errors.deliveryDate}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 mb-5 border border-green-300 dark:border-green-800 box-border rounded-lg md:p-2.5 sm:p-2">
          <p><strong className="text-base text-black dark:text-white block mb-2.5 md:text-sm sm:text-[11px] font-bold">Customer Section</strong></p>
          <div className="flex flex-wrap gap-2.5 items-center">
            <div className="flex items-center mb-1.5 flex-1 min-w-0">
              <label className={`${labelClass} mr-1.5 w-[100px] text-right flex-shrink-0 md:text-xs sm:text-[11px] sm:w-auto sm:text-left sm:mr-0 sm:mb-1 dark:text-gray-300`}>Company Name:</label>
              <input
                type="text"
                name="billToCompany"
                value={formData.billToCompany}
                onChange={handleChange}
                placeholder="Enter company name"
                className={`${inputClass} w-[200px] flex-grow md:text-xs sm:text-[11px] sm:p-1 sm:w-full ${errors.billToCompany ? 'border-red-500' : ''}`}
              />
              {errors.billToCompany && <span className={errorClass}>{errors.billToCompany}</span>}
            </div>
            <div className="flex items-center mb-1.5 flex-1 min-w-0">
              <label className={`${labelClass} mr-1.5 w-[100px] text-right flex-shrink-0 md:text-xs sm:text-[11px] sm:w-auto sm:text-left sm:mr-0 sm:mb-1 dark:text-gray-300`}>Address:</label>
              <input
                type="text"
                name="billToAddress"
                value={formData.billToAddress}
                onChange={handleChange}
                placeholder="Enter address"
                className={`${inputClass} w-[200px] flex-grow md:text-xs sm:text-[11px] sm:p-1 sm:w-full ${errors.billToAddress ? 'border-red-500' : ''}`}
              />
              {errors.billToAddress && <span className={errorClass}>{errors.billToAddress}</span>}
            </div>
            <div className="flex items-center mb-1.5 flex-1 min-w-0">
              <label className={`${labelClass} mr-1.5 w-[100px] text-right flex-shrink-0 md:text-xs sm:text-[11px] sm:w-auto sm:text-left sm:mr-0 sm:mb-1 dark:text-gray-300`}>City/State:</label>
              <input
                type="text"
                name="billToCityState"
                value={formData.billToCityState}
                onChange={handleChange}
                placeholder="Enter city/state"
                className={`${inputClass} w-[200px] flex-grow md:text-xs sm:text-[11px] sm:p-1 sm:w-full ${errors.billToCityState ? 'border-red-500' : ''}`}
              />
              {errors.billToCityState && <span className={errorClass}>{errors.billToCityState}</span>}
            </div>
            <div className="flex items-center mb-1.5 flex-1 min-w-0">
              <label className={`${labelClass} mr-1.5 w-[100px] text-right flex-shrink-0 md:text-xs sm:text-[11px] sm:w-auto sm:text-left sm:mr-0 sm:mb-1 dark:text-gray-300`}>Postal Code:</label>
              <input
                type="text"
                name="billToPostalCode"
                value={formData.billToPostalCode}
                onChange={handleChange}
                placeholder="Enter postal code"
                className={`${inputClass} w-[200px] flex-grow md:text-xs sm:text-[11px] sm:p-1 sm:w-full ${errors.billToPostalCode ? 'border-red-500' : ''}`}
              />
              {errors.billToPostalCode && <span className={errorClass}>{errors.billToPostalCode}</span>}
            </div>
          </div>
        </div>
        <div className="mb-5">
          <table className="w-full border-collapse mb-2.5">
            <thead>
              <tr>
                <th className="border border-green-300 dark:border-green-800 p-2.5 text-left text-sm font-bold bg-green-50 dark:bg-green-900/20 md:text-xs sm:text-[11px] md:p-2 sm:p-1.5">Description</th>
                <th className="border border-green-300 dark:border-green-800 p-2.5 text-left text-sm font-bold bg-green-50 dark:bg-green-900/20 md:text-xs sm:text-[11px] md:p-2 sm:p-1.5">Hours</th>
                <th className="border border-green-300 dark:border-green-800 p-2.5 text-left text-sm font-bold bg-green-50 dark:bg-green-900/20 md:text-xs sm:text-[11px] md:p-2 sm:p-1.5">Rate per Hour</th>
                <th className="border border-green-300 dark:border-green-800 p-2.5 text-left text-sm font-bold bg-green-50 dark:bg-green-900/20 md:text-xs sm:text-[11px] md:p-2 sm:p-1.5">Amount</th>
              </tr>
            </thead>
            <tbody>
              {formData.services.map((service, index) => (
                <tr key={index}>
                  <td className="border border-green-300 dark:border-green-800 p-2.5 text-sm md:text-xs sm:text-[11px] md:p-2 sm:p-1.5">
                    <input
                      type="text"
                      value={service.description}
                      onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                      placeholder="Enter service description"
                      className={`w-full p-1 border border-green-300 dark:border-green-800 rounded text-black md:p-1 sm:p-0.5 ${errors[`serviceDescription${index}`] ? 'border-red-500' : ''}`}
                    />
                    {errors[`serviceDescription${index}`] && (
                      <span className={errorClass}>{errors[`serviceDescription${index}`]}</span>
                    )}
                  </td>
                  <td className="border border-green-300 dark:border-green-800 p-2.5 text-sm md:text-xs sm:text-[11px] md:p-2 sm:p-1.5">
                    <input
                      type="number"
                      value={service.hours}
                      onChange={(e) => handleServiceChange(index, 'hours', e.target.value)}
                      min="0"
                      placeholder="0"
                      className={`w-full p-1 border border-green-300 dark:border-green-800 rounded text-black md:p-1 sm:p-0.5 ${errors[`serviceHours${index}`] ? 'border-red-500' : ''}`}
                    />
                    {errors[`serviceHours${index}`] && (
                      <span className={errorClass}>{errors[`serviceHours${index}`]}</span>
                    )}
                  </td>
                  <td className="border border-green-300 dark:border-green-800 p-2.5 text-sm md:text-xs sm:text-[11px] md:p-2 sm:p-1.5">
                    <input
                      type="number"
                      value={service.ratePerHour}
                      onChange={(e) => handleServiceChange(index, 'ratePerHour', e.target.value)}
                      min="0"
                      placeholder="0"
                      className={`w-full p-1 border border-green-300 dark:border-green-800 rounded text-black md:p-1 sm:p-0.5 ${errors[`serviceRate${index}`] ? 'border-red-500' : ''}`}
                    />
                    {errors[`serviceRate${index}`] && (
                      <span className={errorClass}>{errors[`serviceRate${index}`]}</span>
                    )}
                  </td>
                  <td className="border border-green-300 dark:border-green-800 p-2.5 text-sm md:text-xs sm:text-[11px] md:p-2 sm:p-1.5">{service.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center gap-2.5 mt-2.5">
            <button
              type="button"
              onClick={addService}
              className="p-2 px-4 bg-green-600 text-white border-none rounded cursor-pointer text-sm transition-all hover:bg-green-700 hover:shadow-md hover:scale-105 md:p-1.5 md:text-xs sm:p-1 sm:text-[11px]"
            >
              Add Service
            </button>
            <button
              type="button"
              onClick={removeService}
              disabled={formData.services.length === 1}
              className="p-2 px-4 bg-green-600 text-white border-none rounded cursor-pointer text-sm transition-all hover:bg-green-700 hover:shadow-md hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed md:p-1.5 md:text-xs sm:p-1 sm:text-[11px]"
            >
              Remove Service
            </button>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 mb-5 border border-green-300 dark:border-green-800 flex flex-col rounded-lg md:p-2.5 sm:p-2">
          <p className="m-1.5 text-sm md:text-xs sm:text-[11px]">Subtotal: {calculateSubtotal().toFixed(2)}</p>
          <div className="mb-2.5">
            <label className={`${labelClass} mr-2.5 md:text-xs sm:text-[11px] dark:text-gray-300`}>Tax Rate (%):</label>
            <input
              type="number"
              name="taxRate"
              value={formData.taxRate}
              onChange={handleChange}
              min="0"
              placeholder="0"
              className={`${inputClass} w-[100px] md:w-[80px] md:text-xs sm:w-[70px] sm:text-[11px] sm:p-1 ${errors.taxRate ? 'border-red-500' : ''}`}
            />
            {errors.taxRate && <span className={errorClass}>{errors.taxRate}</span>}
          </div>
          <p className="m-1.5 text-sm md:text-xs sm:text-[11px]">Tax: {calculateTax().toFixed(2)}</p>
          <p className="m-1.5 text-sm md:text-xs sm:text-[11px]"><strong className="text-lg md:text-base sm:text-sm">Total: {calculateTotal().toFixed(2)}</strong></p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 mb-5 border border-green-300 dark:border-green-800 w-full box-border rounded-lg md:p-2.5 sm:p-2">
          <p><strong className="text-base text-black dark:text-white block mb-4 font-bold md:text-sm sm:text-[11px]">Payment & Terms:</strong></p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-2 sm:gap-2">
              <label className={`${labelClass} w-[150px] text-right md:text-xs sm:text-[11px] sm:w-full sm:text-left dark:text-gray-300`}>Payment Terms:</label>
              <div className="flex-1">
                <select
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handlePaymentTermsChange}
                  className={`${inputClass} w-full md:text-xs sm:text-[11px] sm:p-1 ${errors.paymentTerms ? 'border-red-500' : ''}`}
                >
                  <option value="50% Advance, Remaining on Completion">50% Advance, Remaining on Completion</option>
                  <option value="100% Advance">100% Advance</option>
                  <option value="30% Advance, 70% on Completion">30% Advance, 70% on Completion</option>
                  <option value="Custom">Custom</option>
                </select>
                {errors.paymentTerms && <span className={errorClass}>{errors.paymentTerms}</span>}
              </div>
            </div>
            {formData.paymentTerms === 'Custom' && (
              <div className="flex items-start gap-4 md:flex-col md:items-start md:gap-2 sm:gap-2">
                <label className={`${labelClass} w-[150px] text-right md:text-xs sm:text-[11px] sm:w-full sm:text-left dark:text-gray-300`}>Custom Payment Terms:</label>
                <div className="flex-1">
                  <textarea
                    name="customPaymentTerms"
                    value={formData.customPaymentTerms}
                    onChange={handleChange}
                    placeholder="Enter custom payment terms..."
                    rows="3"
                    className={`${inputClass} w-full md:p-1 sm:p-0.5 ${errors.customPaymentTerms ? 'border-red-500' : ''}`}
                  />
                  {errors.customPaymentTerms && (
                    <span className={errorClass}>{errors.customPaymentTerms}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 mb-5 border border-green-300 dark:border-green-800 rounded-lg md:p-2.5 sm:p-2">
          <label htmlFor="notes" className={`${labelClass} block mb-1.5 md:text-xs sm:text-[11px] dark:text-gray-300`}><strong>Notes:</strong></label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter your notes here..."
            rows="4"
            className={`${inputClass} w-[95%] p-2.5 font-sans resize-y min-h-[80px] md:text-xs md:p-2 md:min-h-[60px] sm:text-[11px] sm:p-1.5 sm:min-h-[50px]`}
          />
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 mb-5 border border-green-300 dark:border-green-800 w-full box-border rounded-lg md:p-2.5 sm:p-2">
          <p><strong className="text-base text-black dark:text-white block mb-2.5 font-bold md:text-sm sm:text-[11px]">Terms and Conditions</strong></p>
          <ol className="pl-5 m-0 text-sm text-gray-700 dark:text-gray-300 md:text-xs md:pl-4 sm:text-[11px] sm:pl-2.5">
            <li className="mb-1.5 md:mb-1 sm:mb-0.5">1. Payment is due within 30 days of the invoice date.</li>
            <li className="mb-1.5 md:mb-1 sm:mb-0.5">2. Late payments will incur a 2% monthly interest charge.</li>
            <li className="mb-1.5 md:mb-1 sm:mb-0.5">3. All services are subject to the terms agreed upon in the contract.</li>
            <li className="mb-1.5 md:mb-1 sm:mb-0.5">4. Tech Elecon Pvt Ltd reserves the right to modify these terms with prior notice.</li>
          </ol>
        </div>
        <div className="flex justify-between mt-5">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 p-2.5 px-5 text-white border-none rounded cursor-pointer text-sm transition-all hover:bg-gray-600 hover:shadow-md md:p-2 md:text-xs sm:p-1.5 sm:text-[11px]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-700 p-2.5 px-5 text-white border-none rounded cursor-pointer text-sm transition-all hover:bg-green-800 hover:shadow-md hover:scale-105 md:p-2 md:text-xs sm:p-1.5 sm:text-[11px]"
          >
            Submit Quotation
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuotationForm;
