import React, { useState } from 'react';

const POForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    cityState: '',
    postalCode: '',
    email: '',
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
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';
    if (typeof value === 'string' && !value.trim()) {
      if (['billToCompany', 'billToAddress', 'billToCityState', 'billToPostalCode', 'poNumber', 'date', 'deliveryDate'].includes(name)) {
        error = `${name.replace(/([A-Z])/g, ' $1')} is required`;
      }
    } else if (name === 'taxRate' && typeof value === 'number' && value < 0) {
      error = 'Tax rate cannot be negative';
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
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
  const calculateSubtotal = () => formData.services.reduce((sum, service) => sum + (service.amount || 0), 0);
  const calculateTax = () => (calculateSubtotal() * (formData.taxRate || 0)) / 100;
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (key !== 'services' && key !== 'notes') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    formData.services.forEach((service, index) => {
      if (!service.description.trim()) {
        newErrors[`serviceDescription${index}`] = 'Service description is required';
      }
      if (service.hours <= 0) {
        newErrors[`serviceHours${index}`] = 'Hours must be greater than 0';
      }
      if (service.ratePerHour <= 0) {
        newErrors[`serviceRate${index}`] = 'Rate per hour must be greater than 0';
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const submissionData = {
        ...formData,
        poNumber: `PO-${formData.poNumber}`,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        total: calculateTotal(),
      };
      console.log('Form submitted:', submissionData);
      alert('Purchase Order submitted successfully!');
    } else {
      console.log('Form has errors:', newErrors);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full min-h-screen m-0 p-5 bg-green-50 flex flex-col md:p-3 sm:p-2"
    >
      <h1
        className="text-gray-900 text-4xl font-bold text-center m-0 mb-5 p-2.5 bg-green-50 relative 
        before:content-['Purchase_Order'] before:absolute before:top-1/2 before:left-1/2 
        before:-translate-x-1/2 before:-translate-y-1/2 before:text-green-100 before:text-4xl before:-z-10 
        md:text-3xl sm:text-2xl md:before:text-3xl sm:before:text-2xl"
      >
        Purchase Order
      </h1>
      <div className="flex justify-between items-start bg-white p-4 mb-5 border border-gray-300 rounded-lg shadow-md md:flex-col sm:p-2.5">
        <div className="w-[45%] text-left md:w-full md:mb-2.5"></div>
        <div className="text-right w-auto md:w-full md:text-right">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-end md:justify-start">
              <label className="font-bold mr-1.5 text-sm text-gray-600 md:text-xs sm:text-[11px]">Purchase Order Number:</label>
              <div className="flex items-center">
                <span className="p-1.5 bg-gray-100 border border-r-0 border-gray-300 rounded-l text-sm text-gray-600">PO-</span>
                <input
                  type="text"
                  name="poNumber"
                  value={formData.poNumber}
                  onChange={handleChange}
                  placeholder="Enter number"
                  className={`p-1.5 border border-gray-300 rounded-r w-[120px] text-sm md:w-[100px] sm:w-[80px] sm:text-[11px] ${errors.poNumber ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.poNumber && <span className="text-red-500 text-xs block mt-1.5">{errors.poNumber}</span>}
            </div>
            <div className="flex items-center justify-end md:justify-start">
              <label className="font-bold mr-1.5 text-sm text-gray-600 md:text-xs sm:text-[11px]">Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`p-1.5 border border-gray-300 rounded w-[150px] text-sm md:w-[120px] sm:w-[100px] sm:text-[11px] ${errors.date ? 'border-red-500' : ''}`}
              />
              {formData.date && (
                <span className="ml-2 text-sm text-gray-600 md:text-xs sm:text-[11px]">{formatDate(formData.date)}</span>
              )}
              {errors.date && <span className="text-red-500 text-xs block mt-1.5">{errors.date}</span>}
            </div>
            <div className="flex items-center justify-end md:justify-start">
              <label className="font-bold mr-1.5 text-sm text-gray-600 md:text-xs sm:text-[11px]">Delivery Date:</label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                className={`p-1.5 border border-gray-300 rounded w-[150px] text-sm md:w-[120px] sm:w-[100px] sm:text-[11px] ${errors.deliveryDate ? 'border-red-500' : ''}`}
              />
              {formData.deliveryDate && (
                <span className="ml-2 text-sm text-gray-600 md:text-xs sm:text-[11px]">{formatDate(formData.deliveryDate)}</span>
              )}
              {errors.deliveryDate && <span className="text-red-500 text-xs block mt-1.5">{errors.deliveryDate}</span>}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 mb-5 border border-gray-300 rounded-lg shadow-md md:p-2.5 sm:p-2">
        <strong className="text-base text-gray-900 block mb-2.5 md:text-sm sm:text-[11px]">Customer Section</strong>
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col">
            <label className="font-bold mb-1 text-sm text-gray-600 md:text-xs sm:text-[11px]">Company Name:</label>
            <input
              type="text"
              name="billToCompany"
              value={formData.billToCompany}
              onChange={handleChange}
              placeholder="Enter company name"
              className={`p-2 border border-gray-300 rounded w-full text-sm bg-white text-gray-700 focus:outline-none focus:border-green-600 focus:shadow-[0_0_5px_rgba(40,167,69,0.3)] md:text-xs sm:text-[11px] sm:p-1.5 ${errors.billToCompany ? 'border-red-500' : ''}`}
            />
            {errors.billToCompany && <span className="text-red-500 text-xs mt-1">{errors.billToCompany}</span>}
          </div>
          <div className="flex flex-col">
            <label className="font-bold mb-1 text-sm text-gray-600 md:text-xs sm:text-[11px]">Address:</label>
            <input
              type="text"
              name="billToAddress"
              value={formData.billToAddress}
              onChange={handleChange}
              placeholder="Enter address"
              className={`p-2 border border-gray-300 rounded w-full text-sm bg-white text-gray-700 focus:outline-none focus:border-green-600 focus:shadow-[0_0_5px_rgba(40,167,69,0.3)] md:text-xs sm:text-[11px] sm:p-1.5 ${errors.billToAddress ? 'border-red-500' : ''}`}
            />
            {errors.billToAddress && <span className="text-red-500 text-xs mt-1">{errors.billToAddress}</span>}
          </div>
          <div className="flex flex-col">
            <label className="font-bold mb-1 text-sm text-gray-600 md:text-xs sm:text-[11px]">City/State:</label>
            <input
              type="text"
              name="billToCityState"
              value={formData.billToCityState}
              onChange={handleChange}
              placeholder="Enter city/state"
              className={`p-2 border border-gray-300 rounded w-full text-sm bg-white text-gray-700 focus:outline-none focus:border-green-600 focus:shadow-[0_0_5px_rgba(40,167,69,0.3)] md:text-xs sm:text-[11px] sm:p-1.5 ${errors.billToCityState ? 'border-red-500' : ''}`}
            />
            {errors.billToCityState && <span className="text-red-500 text-xs mt-1">{errors.billToCityState}</span>}
          </div>
          <div className="flex flex-col">
            <label className="font-bold mb-1 text-sm text-gray-600 md:text-xs sm:text-[11px]">Postal Code:</label>
            <input
              type="text"
              name="billToPostalCode"
              value={formData.billToPostalCode}
              onChange={handleChange}
              placeholder="Enter postal code"
              className={`p-2 border border-gray-300 rounded w-full text-sm bg-white text-gray-700 focus:outline-none focus:border-green-600 focus:shadow-[0_0_5px_rgba(40,167,69,0.3)] md:text-xs sm:text-[11px] sm:p-1.5 ${errors.billToPostalCode ? 'border-red-500' : ''}`}
            />
            {errors.billToPostalCode && <span className="text-red-500 text-xs mt-1">{errors.billToPostalCode}</span>}
          </div>
        </div>
      </div>
      <div className="mb-5">
        <table className="w-full border-collapse mb-2.5">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2.5 text-left text-sm font-bold bg-gray-100 md:text-xs sm:text-[11px] md:p-2 sm:p-1.5">Description</th>
              <th className="border border-gray-300 p-2.5 text-left text-sm font-bold bg-gray-100 md:text-xs sm:text-[11px] md:p-2 sm:p-1.5">Hours</th>
              <th className="border border-gray-300 p-2.5 text-left text-sm font-bold bg-gray-100 md:text-xs sm:text-[11px] md:p-2 sm:p-1.5">Rate per Hour</th>
              <th className="border border-gray-300 p-2.5 text-left text-sm font-bold bg-gray-100 md:text-xs sm:text-[11px] md:p-2 sm:p-1.5">Amount</th>
            </tr>
          </thead>
          <tbody>
            {formData.services.map((service, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2.5 text-sm md:text-xs sm:text-[11px] md:p-2 sm:p-1.5">
                  <input
                    type="text"
                    value={service.description}
                    onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                    placeholder="Enter service description"
                    className={`w-full p-1 border border-gray-300 rounded md:p-1 sm:p-0.5 ${errors[`serviceDescription${index}`] ? 'border-red-500' : ''}`}
                  />
                  {errors[`serviceDescription${index}`] && (
                    <span className="text-red-500 text-xs block mt-1.5">{errors[`serviceDescription${index}`]}</span>
                  )}
                </td>
                <td className="border border-gray-300 p-2.5 text-sm md:text-xs sm:text-[11px] md:p-2 sm:p-1.5">
                  <input
                    type="number"
                    value={service.hours}
                    onChange={(e) => handleServiceChange(index, 'hours', e.target.value)}
                    min="0"
                    placeholder="0"
                    className={`w-full p-1 border border-gray-300 rounded md:p-1 sm:p-0.5 ${errors[`serviceHours${index}`] ? 'border-red-500' : ''}`}
                  />
                  {errors[`serviceHours${index}`] && (
                    <span className="text-red-500 text-xs block mt-1.5">{errors[`serviceHours${index}`]}</span>
                  )}
                </td>
                <td className="border border-gray-300 p-2.5 text-sm md:text-xs sm:text-[11px] md:p-2 sm:p-1.5">
                  <input
                    type="number"
                    value={service.ratePerHour}
                    onChange={(e) => handleServiceChange(index, 'ratePerHour', e.target.value)}
                    min="0"
                    placeholder="0"
                    className={`w-full p-1 border border-gray-300 rounded md:p-1 sm:p-0.5 ${errors[`serviceRate${index}`] ? 'border-red-500' : ''}`}
                  />
                  {errors[`serviceRate${index}`] && (
                    <span className="text-red-500 text-xs block mt-1.5">{errors[`serviceRate${index}`]}</span>
                  )}
                </td>
                <td className="border border-gray-300 p-2.5 text-sm md:text-xs sm:text-[11px] md:p-2 sm:p-1.5">{service.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center gap-2.5 mt-2.5">
          <button
            type="button"
            onClick={addService}
            className="p-2 px-4 bg-green-600 text-white border-none rounded text-sm hover:bg-green-700 hover:shadow-md hover:scale-105 md:p-1.5 md:text-xs sm:p-1 sm:text-[11px]"
          >
            Add Service
          </button>
          <button
            type="button"
            onClick={removeService}
            disabled={formData.services.length === 1}
            className="p-2 px-4 bg-white text-gray-600 border border-gray-300 rounded text-sm hover:bg-gray-100 hover:shadow-md hover:scale-105 disabled:bg-gray-200 disabled:cursor-not-allowed md:p-1.5 md:text-xs sm:p-1 sm:text-[11px]"
          >
            Remove Service
          </button>
        </div>
      </div>
      <div className="bg-white p-4 mb-5 border border-gray-300 rounded-lg shadow-md flex flex-col md:p-2.5 sm:p-2">
        <p className="m-1.5 text-sm text-gray-600 md:text-xs sm:text-[11px]">Subtotal: {calculateSubtotal().toFixed(2)}</p>
        <div className="mb-2.5">
          <label className="font-bold mr-2.5 text-gray-600 md:text-xs sm:text-[11px]">Tax Rate (%):</label>
          <input
            type="number"
            name="taxRate"
            value={formData.taxRate}
            onChange={handleChange}
            min="0"
            placeholder="0"
            className={`p-1.5 border border-gray-300 rounded w-[100px] md:w-[80px] md:text-xs sm:w-[70px] sm:text-[11px] sm:p-1 ${errors.taxRate ? 'border-red-500' : ''}`}
          />
          {errors.taxRate && <span className="text-red-500 text-xs block mt-1.5">{errors.taxRate}</span>}
        </div>
        <p className="m-1.5 text-sm text-gray-600 md:text-xs sm:text-[11px]">Tax: {calculateTax().toFixed(2)}</p>
        <p className="m-1.5 text-sm text-gray-600 md:text-xs sm:text-[11px]">
          <strong className="text-lg text-gray-900 md:text-base sm:text-sm">Total: {calculateTotal().toFixed(2)}</strong>
        </p>
      </div>
      <div className="bg-white p-4 mb-5 border border-gray-300 rounded-lg shadow-md md:p-2.5 sm:p-2">
        <label htmlFor="notes" className="font-bold text-sm text-gray-600 block mb-1.5 md:text-xs sm:text-[11px]"><strong>Notes:</strong></label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Enter your notes here..."
          rows={4}
          className="w-full p-2.5 border border-gray-300 rounded text-sm resize-y min-h-[80px] md:text-xs md:p-2 md:min-h-[60px] sm:text-[11px] sm:p-1.5 sm:min-h-[50px]"
        />
      </div>
      <div className="bg-white p-4 mb-5 border border-gray-300 rounded-lg shadow-md w-full md:p-2.5 sm:p-2">
        <p className="m-0"><strong className="text-base text-gray-900 block mb-2.5 font-bold md:text-sm sm:text-[11px]">Terms and Conditions</strong></p>
        <ol className="pl-5 m-0 text-sm text-gray-600 md:text-xs md:pl-4 sm:text-[11px] sm:pl-2.5">
          <li className="mb-1.5 md:mb-1 sm:mb-0.5">1. Payment is due within 30 days of the invoice date.</li>
          <li className="mb-1.5 md:mb-1 sm:mb-0.5">2. Late payments will incur a 2% monthly interest charge.</li>
          <li className="mb-1.5 md:mb-1 sm:mb-0.5">3. All services are subject to the terms agreed upon in the contract.</li>
          <li className="mb-1.5 md:mb-1 sm:mb-0.5">4. The company reserves the right to modify these terms with prior notice.</li>
        </ol>
      </div>
      <button
        type="submit"
        className="bg-green-600 p-2.5 px-5 text-white border-none rounded text-sm mt-5 block mx-auto hover:bg-green-700 hover:shadow-md hover:scale-105 md:p-2 md:text-xs sm:p-1.5 sm:text-[11px]"
      >
        Submit Purchase Order
      </button>
    </form>
  );
};

export default POForm;