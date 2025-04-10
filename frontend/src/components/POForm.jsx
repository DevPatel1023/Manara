"use client"

import { useState } from "react"
import axios from "axios"

// Add this near the top of your component
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id)
}

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
    services: [{ description: "", hours: 0, ratePerHour: 0, amount: 0 }],
    taxRate: 0,
    notes: "",
  })

  const [errors, setErrors] = useState({})

  const validateField = (name, value) => {
    let error = ""
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
        error = `${name
          .split(".")
          .pop()
          .replace(/([A-Z])/g, " $1")} is required`
      }
    } else if (name === "taxRate" && value < 0) {
      error = "Tax rate cannot be negative"
    } else if (name === "quotationId" && value.trim() && !/^[0-9a-fA-F]{24}$/.test(value)) {
      error = "Quotation ID must be a valid MongoDB ObjectId (24 hex characters)"
    }
    return error
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith("billTo.")) {
      const field = name.split(".")[1]
      setFormData({
        ...formData,
        billTo: { ...formData.billTo, [field]: value },
      })
      setErrors({
        ...errors,
        [`billTo.${field}`]: validateField(`billTo.${field}`, value),
      })
    } else {
      setFormData({ ...formData, [name]: value })
      setErrors({ ...errors, [name]: validateField(name, value) })
    }
  }

  const handleServiceChange = (index, field, value) => {
    const newServices = [...formData.services]
    if (field === "description") {
      newServices[index][field] = value
    } else if (field === "hours" || field === "ratePerHour") {
      newServices[index][field] = Number.parseFloat(value) || 0
      newServices[index].amount = calculateAmountForService(newServices[index].hours, newServices[index].ratePerHour)
    }
    setFormData({ ...formData, services: newServices })
  }

  const addService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { description: "", hours: 0, ratePerHour: 0, amount: 0 }],
    })
  }

  const removeService = () => {
    if (formData.services.length > 1) {
      setFormData({
        ...formData,
        services: formData.services.slice(0, -1),
      })
    }
  }

  const calculateAmountForService = (hours, ratePerHour) => hours * ratePerHour
  const calculateSubtotal = () => formData.services.reduce((sum, service) => sum + (service.amount || 0), 0)
  const calculateTax = () => (calculateSubtotal() * (formData.taxRate || 0)) / 100
  const calculateTotal = () => calculateSubtotal() + calculateTax()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    // Validation logic
    ;["quotationId", "poNumber", "date", "deliveryDate", "taxRate"].forEach((key) => {
      const error = validateField(key, formData[key])
      if (error) newErrors[key] = error
    })

    Object.keys(formData.billTo).forEach((key) => {
      const error = validateField(`billTo.${key}`, formData.billTo[key])
      if (error) newErrors[`billTo.${key}`] = error
    })

    formData.services.forEach((service, index) => {
      if (!service.description || !service.description.trim()) {
        newErrors[`serviceDescription${index}`] = "Service description is required"
      }
      if (service.hours <= 0) {
        newErrors[`serviceHours${index}`] = "Hours must be greater than 0"
      }
      if (service.ratePerHour <= 0) {
        newErrors[`serviceRatePerHour${index}`] = "Rate per hour must be greater than 0"
      }
    })

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      const token = localStorage.getItem("token")

      if (!token) {
        alert("You must be logged in to submit a purchase order")
        return
      }

      // Format dates properly for the backend
      const formattedDate = new Date(formData.date).toISOString()
      const formattedDeliveryDate = new Date(formData.deliveryDate).toISOString()

      // Ensure services have all required fields and proper format
      const formattedServices = formData.services.map((service) => ({
        description: service.description.trim(),
        hours: Number(service.hours),
        ratePerHour: Number(service.ratePerHour),
        amount: Number(service.amount),
      }))

      const submissionData = {
        quotationId: formData.quotationId.trim(),
        poNumber: formData.poNumber.trim(),
        date: formattedDate,
        deliveryDate: formattedDeliveryDate,
        billTo: {
          company: formData.billTo.company.trim(),
          address: formData.billTo.address.trim(),
          cityState: formData.billTo.cityState.trim(),
          postalCode: formData.billTo.postalCode.trim(),
          phone: formData.billTo.phone.trim(),
          email: formData.billTo.email.trim(),
        },
        services: formattedServices,
        taxRate: Number(formData.taxRate) || 0,
        notes: formData.notes.trim(),
      }

      try {
        console.log("Submission Data:", submissionData)
        
        const response = await axios.post("http://localhost:3000/api/v1/PO/submitpo", submissionData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log("Form submitted successfully:", response.data)
        alert("Purchase Order submitted successfully!")
        setFormData({
          quotationId: "",
          poNumber: "",
          date: "",
          deliveryDate: "",
          billTo: { company: "", address: "", cityState: "", postalCode: "", phone: "", email: "" },
          services: [{ description: "", hours: 0, ratePerHour: 0, amount: 0 }],
          taxRate: 0,
          notes: "",
        })
      } catch (error) {
        console.error("Error submitting PO:", error)
        const errorMessage = error.response?.data?.message || error.message
        console.error("Server response:", error.response?.data)
        alert(`Failed to submit Purchase Order: ${errorMessage}`)
      }
    } else {
      console.log("Form has errors:", newErrors)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full min-h-screen m-0 p-5 bg-[#1b263b] flex flex-col md:p-3 sm:p-2 text-white"
    >
      <h1
        className="text-white text-4xl font-bold text-center m-0 mb-5 p-2.5 bg-[#1b263b] relative 
        before:content-['Purchase_Order'] before:absolute before:top-1/2 before:left-1/2 
        before:-translate-x-1/2 before:-translate-y-1/2 before:text-gray-700 before:text-4xl before:-z-10 
        md:text-3xl sm:text-2xl md:before:text-3xl sm:before:text-2xl"
      >
        Purchase Order
      </h1>

      <div className="flex justify-between items-start bg-[#2e3951] p-4 mb-5 border border-gray-600 rounded-lg shadow-md md:flex-col sm:p-2.5">
        <div className="w-[45%] md:w-full md:mb-2.5">
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col">
              <label className="font-bold mb-1 text-sm text-gray-300 md:text-xs sm:text-[11px]">Quotation ID:</label>
              <input
                type="text"
                name="quotationId"
                value={formData.quotationId}
                onChange={handleChange}
                placeholder="Enter quotation ID (24 character MongoDB ID)"
                className={`p-2 border border-gray-500 rounded w-full text-sm bg-[#3a4560] text-white ${errors.quotationId ? "border-red-500" : ""}`}
              />
              {errors.quotationId && <span className="text-red-400 text-xs mt-1">{errors.quotationId}</span>}
              <span className="text-gray-400 text-xs mt-1">Must be a valid MongoDB ObjectId (24 hex characters)</span>
            </div>
          </div>
        </div>
        <div className="text-right w-auto md:w-full md:text-right">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-end md:justify-start">
              <label className="font-bold mr-1.5 text-sm text-gray-300 md:text-xs sm:text-[11px]">
                Purchase Order Number:
              </label>
              <div className="flex items-center">
                <span className="p-1.5 bg-gray-600 border border-r-0 border-gray-500 rounded-l text-sm text-gray-300">
                  PO-
                </span>
                <input
                  type="text"
                  name="poNumber"
                  value={formData.poNumber}
                  onChange={handleChange}
                  placeholder="Enter number"
                  className={`p-1.5 border border-gray-500 rounded-r w-[120px] text-sm bg-[#3a4560] text-white ${errors.poNumber ? "border-red-500" : ""}`}
                />
              </div>
              {errors.poNumber && <span className="text-red-400 text-xs block mt-1.5">{errors.poNumber}</span>}
            </div>
            <div className="flex items-center justify-end md:justify-start">
              <label className="font-bold mr-1.5 text-sm text-gray-300 md:text-xs sm:text-[11px]">Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`p-1.5 border border-gray-500 rounded w-[150px] text-sm bg-[#3a4560] text-white ${errors.date ? "border-red-500" : ""}`}
              />
              {formData.date && <span className="ml-2 text-sm text-gray-300">{formatDate(formData.date)}</span>}
              {errors.date && <span className="text-red-400 text-xs block mt-1.5">{errors.date}</span>}
            </div>
            <div className="flex items-center justify-end md:justify-start">
              <label className="font-bold mr-1.5 text-sm text-gray-300 md:text-xs sm:text-[11px]">Delivery Date:</label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                className={`p-1.5 border border-gray-500 rounded w-[150px] text-sm bg-[#3a4560] text-white ${errors.deliveryDate ? "border-red-500" : ""}`}
              />
              {formData.deliveryDate && (
                <span className="ml-2 text-sm text-gray-300">{formatDate(formData.deliveryDate)}</span>
              )}
              {errors.deliveryDate && <span className="text-red-400 text-xs block mt-1.5">{errors.deliveryDate}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#2e3951] p-4 mb-5 border border-gray-600 rounded-lg shadow-md md:p-2.5 sm:p-2">
        <strong className="text-base text-white block mb-2.5 md:text-sm sm:text-[11px]">Bill To</strong>
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col">
            <label className="font-bold mb-1 text-sm text-gray-300">Company:</label>
            <input
              type="text"
              name="billTo.company"
              value={formData.billTo.company}
              onChange={handleChange}
              placeholder="Enter company name"
              className={`p-2 border border-gray-500 rounded w-full text-sm bg-[#3a4560] text-white ${errors["billTo.company"] ? "border-red-500" : ""}`}
            />
            {errors["billTo.company"] && <span className="text-red-400 text-xs mt-1">{errors["billTo.company"]}</span>}
          </div>
          <div className="flex flex-col">
            <label className="font-bold mb-1 text-sm text-gray-300">Address:</label>
            <input
              type="text"
              name="billTo.address"
              value={formData.billTo.address}
              onChange={handleChange}
              placeholder="Enter address"
              className={`p-2 border border-gray-500 rounded w-full text-sm bg-[#3a4560] text-white ${errors["billTo.address"] ? "border-red-500" : ""}`}
            />
            {errors["billTo.address"] && <span className="text-red-400 text-xs mt-1">{errors["billTo.address"]}</span>}
          </div>
          <div className="flex flex-col">
            <label className="font-bold mb-1 text-sm text-gray-300">City/State:</label>
            <input
              type="text"
              name="billTo.cityState"
              value={formData.billTo.cityState}
              onChange={handleChange}
              placeholder="Enter city/state"
              className={`p-2 border border-gray-500 rounded w-full text-sm bg-[#3a4560] text-white ${errors["billTo.cityState"] ? "border-red-500" : ""}`}
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
              className={`p-2 border border-gray-500 rounded w-full text-sm bg-[#3a4560] text-white ${errors["billTo.postalCode"] ? "border-red-500" : ""}`}
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
              className={`p-2 border border-gray-500 rounded w-full text-sm bg-[#3a4560] text-white ${errors["billTo.phone"] ? "border-red-500" : ""}`}
            />
            {errors["billTo.phone"] && <span className="text-red-400 text-xs mt-1">{errors["billTo.phone"]}</span>}
          </div>
          <div className="flex flex-col">
            <label className="font-bold mb-1 text-sm text-gray-300">Email:</label>
            <input
              type="email"
              name="billTo.email"
              value={formData.billTo.email}
              onChange={handleChange}
              placeholder="Enter email"
              className={`p-2 border border-gray-500 rounded w-full text-sm bg-[#3a4560] text-white ${errors["billTo.email"] ? "border-red-500" : ""}`}
            />
            {errors["billTo.email"] && <span className="text-red-400 text-xs mt-1">{errors["billTo.email"]}</span>}
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
                    className={`w-full p-1 border border-gray-500 rounded bg-[#4a5570] text-white ${errors[`serviceDescription${index}`] ? "border-red-500" : ""}`}
                  />
                  {errors[`serviceDescription${index}`] && (
                    <span className="text-red-400 text-xs block mt-1.5">{errors[`serviceDescription${index}`]}</span>
                  )}
                </td>
                <td className="border border-gray-600 p-2.5 bg-[#3a4560]">
                  <input
                    type="number"
                    value={service.hours}
                    onChange={(e) => handleServiceChange(index, "hours", e.target.value)}
                    min="0"
                    placeholder="0"
                    className={`w-full p-1 border border-gray-500 rounded bg-[#4a5570] text-white ${errors[`serviceHours${index}`] ? "border-red-500" : ""}`}
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
                    placeholder="0"
                    className={`w-full p-1 border border-gray-500 rounded bg-[#4a5570] text-white ${errors[`serviceRatePerHour${index}`] ? "border-red-500" : ""}`}
                  />
                  {errors[`serviceRatePerHour${index}`] && (
                    <span className="text-red-400 text-xs block mt-1.5">{errors[`serviceRatePerHour${index}`]}</span>
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
            className="p-2 px-4 bg-blue-600 text-white border-none rounded text-sm hover:bg-blue-700"
          >
            Add Service
          </button>
          <button
            type="button"
            onClick={removeService}
            disabled={formData.services.length === 1}
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
            placeholder="0"
            className={`p-1.5 border border-gray-500 rounded w-[100px] bg-[#3a4560] text-white ${errors.taxRate ? "border-red-500" : ""}`}
          />
          {errors.taxRate && <span className="text-red-400 text-xs block mt-1.5">{errors.taxRate}</span>}
        </div>
        <p className="m-1.5 text-sm text-gray-300">Tax: {calculateTax().toFixed(2)}</p>
        <p className="m-1.5 text-sm text-gray-300">
          <strong className="text-lg text-white">Total: {calculateTotal().toFixed(2)}</strong>
        </p>
      </div>

      <div className="bg-[#2e3951] p-4 mb-5 border border-gray-600 rounded-lg shadow-md">
        <label htmlFor="notes" className="font-bold text-sm text-gray-300 block mb-1.5">
          <strong>Notes:</strong>
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Enter your notes here..."
          rows={4}
          className="w-full p-2.5 border border-gray-500 rounded text-sm resize-y min-h-[80px] bg-[#3a4560] text-white"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 p-2.5 px-5 text-white border-none rounded text-sm mt-5 block mx-auto hover:bg-blue-700"
      >
        Submit Purchase Order
      </button>
    </form>
  )
}

export default POForm
