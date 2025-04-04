import React, { useState } from 'react';
import '../styles/POForm.css';
import techEleconLogo from './tech_elecon_logo.jpeg'; 

const POForm = () => {
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
    services: [
      { description: '', hours: 0, ratePerHour: 0, amount: 0 },
    ],
    taxRate: 0,
    notes: '', 
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
        if (!value.trim()) error = 'Purchase Order number is required';
        break;
      case 'date':
      case 'deliveryDate':
        if (!value) error = 'Date is required';
        break;
      case 'taxRate':
        if (value < 0) error = 'Tax rate cannot be negative';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== 'services' && key !== 'notes') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    formData.services.forEach((service, index) => {
      if (!service.description.trim()) {
        newErrors[serviceDescription${index}] = 'Service description is required';
      }
      if (service.hours <= 0) {
        newErrors[serviceHours${index}] = 'Hours must be greater than 0';
      }
      if (service.ratePerHour <= 0) {
        newErrors[serviceRate${index}] = 'Rate per hour must be greater than 0';
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const submissionData = {
        ...formData,
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

  return (
    <form onSubmit={handleSubmit} className="purchase-order">
      <h1>Purchase Order</h1>
      <div className="header">
        <div className="company-details">
          <strong>{formData.companyName}</strong>
          <p>Address: {formData.address}</p>
          <p>City/State: {formData.cityState}</p>
          <p>Postal Code: {formData.postalCode}</p>
          <p>Email Address: {formData.email}</p>
        </div>
        <div className="po-details">
          <div>
            <label>Purchase Order:</label>
            <input
              type="text"
              name="poNumber"
              value={formData.poNumber}
              onChange={handleChange}
              placeholder="Enter PO number"
              className={errors.poNumber ? 'error' : ''}
            />
            {errors.poNumber && <span className="error-message">{errors.poNumber}</span>}
          </div>
          <div>
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={errors.date ? 'error' : ''}
            />
            {errors.date && <span className="error-message">{errors.date}</span>}
          </div>
          <div>
            <label>Delivery Date:</label>
            <input
              type="date"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
              className={errors.deliveryDate ? 'error' : ''}
            />
            {errors.deliveryDate && <span className="error-message">{errors.deliveryDate}</span>}
          </div>
        </div>
      </div>
      <div className="bill-to-section">
        <p><strong>Customer Section</strong></p>
        <div className="bill-to-row">
          <div>
            <label>Company Name:</label>
            <input
              type="text"
              name="billToCompany"
              value={formData.billToCompany}
              onChange={handleChange}
              placeholder="Enter company name"
              className={errors.billToCompany ? 'error' : ''}
            />
            {errors.billToCompany && <span className="error-message">{errors.billToCompany}</span>}
          </div>
          <div>
            <label>Address:</label>
            <input
              type="text"
              name="billToAddress"
              value={formData.billToAddress}
              onChange={handleChange}
              placeholder="Enter address"
              className={errors.billToAddress ? 'error' : ''}
            />
            {errors.billToAddress && <span className="error-message">{errors.billToAddress}</span>}
          </div>
          <div>
            <label>City/State:</label>
            <input
              type="text"
              name="billToCityState"
              value={formData.billToCityState}
              onChange={handleChange}
              placeholder="Enter city/state"
              className={errors.billToCityState ? 'error' : ''}
            />
            {errors.billToCityState && <span className="error-message">{errors.billToCityState}</span>}
          </div>
          <div>
            <label>Postal Code:</label>
            <input
              type="text"
              name="billToPostalCode"
              value={formData.billToPostalCode}
              onChange={handleChange}
              placeholder="Enter postal code"
              className={errors.billToPostalCode ? 'error' : ''}
            />
            {errors.billToPostalCode && <span className="error-message">{errors.billToPostalCode}</span>}
          </div>
        </div>
      </div>
      <div className="service-section">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Hours</th>
              <th>Rate per Hour</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {formData.services.map((service, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={service.description}
                    onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                    placeholder="Enter service description"
                    className={errors[serviceDescription${index}] ? 'error' : ''}
                  />
                  {errors[serviceDescription${index}] && (
                    <span className="error-message">{errors[serviceDescription${index}]}</span>
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    value={service.hours}
                    onChange={(e) => handleServiceChange(index, 'hours', e.target.value)}
                    min="0"
                    placeholder="0"
                    className={errors[serviceHours${index}] ? 'error' : ''}
                  />
                  {errors[serviceHours${index}] && (
                    <span className="error-message">{errors[serviceHours${index}]}</span>
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    value={service.ratePerHour}
                    onChange={(e) => handleServiceChange(index, 'ratePerHour', e.target.value)}
                    min="0"
                    placeholder="0"
                    className={errors[serviceRate${index}] ? 'error' : ''}
                  />
                  {errors[serviceRate${index}] && (
                    <span className="error-message">{errors[serviceRate${index}]}</span>
                  )}
                </td>
                <td>{service.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="button-container">
          <button type="button" onClick={addService}>Add Service</button>
          <button type="button" onClick={removeService} disabled={formData.services.length === 1}>
            Remove Service
          </button>
        </div>
      </div>
      <div className="summary">
        <p>Subtotal: {calculateSubtotal().toFixed(2)}</p>
        <div>
          <label>Tax Rate (%):</label>
          <input
            type="number"
            name="taxRate"
            value={formData.taxRate}
            onChange={handleChange}
            min="0"
            placeholder="0"
            className={errors.taxRate ? 'error' : ''}
          />
          {errors.taxRate && <span className="error-message">{errors.taxRate}</span>}
        </div>
        <p>Tax: {calculateTax().toFixed(2)}</p>
        <p><strong>Total: {calculateTotal().toFixed(2)}</strong></p>
      </div>
      <div className="notes">
        <label htmlFor="notes"><strong>Notes:</strong></label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Enter your notes here..."
          rows="4"
          className="notes-textarea"
        />
      </div>

      {/* Add the Terms and Conditions Section Here */}
      <div className="terms-conditions-section">
        <p><strong>Terms and Conditions</strong></p>
        <ol>
          <li>1. Payment is due within 30 days of the invoice date.</li>
          <li>2. Late payments will incur a 2% monthly interest charge.</li>
          <li>3. All services are subject to the terms agreed upon in the contract.</li>
          <li>4. Tech Elecon Pvt Ltd reserves the right to modify these terms with prior notice.</li>
        </ol>
      </div>

      <footer className="footer">
        <a href="http://www.techelecon.com">techelecon.com</a>
        <img src={techEleconLogo} alt="TechElecon Logo" className="logo" />
      </footer>
      <button type="submit" className="submit-button">Submit Purchase Order</button>
    </form>
  );
};

export default POForm;