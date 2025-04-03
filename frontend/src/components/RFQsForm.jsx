import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

const RFQsForm = ({ setIsOpen, fetchRFQs }) => {
  const [formValue, setFormValue] = useState({
    title: "",
    quantity: "",
    description: "",
    deadline: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });

    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formValue.title.trim()) {
      errors.title = "Item title is required";
      isValid = false;
    }

    if (!formValue.quantity || formValue.quantity <= 0) {
      errors.quantity = "Valid quantity is required";
      isValid = false;
    }

    if (!formValue.deadline) {
      errors.deadline = "Deadline is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/v1/RFQS/submitRfq",
        formValue,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("RFQ submitted successfully!");
      setFormValue({ title: "", quantity: "", description: "", deadline: "" });
      setTimeout(() => {
        setIsOpen(false);
        fetchRFQs();
      }, 2000);
    } catch (error) {
      setError("Failed to submit RFQ. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Create New RFQ</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-full transition-colors duration-200"
        >
          <X size={20} />
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className="block mb-2 text-sm text-gray-900 dark:text-white">Item</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter Items here..."
            className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
            value={formValue.title}
            onChange={handleChange}
          />
          {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
        </div>

        <div>
          <label htmlFor="quantity" className="block mb-2 text-sm text-gray-900 dark:text-white">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            placeholder="Quantity of Items..."
            className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
            value={formValue.quantity}
            onChange={handleChange}
          />
          {formErrors.quantity && <p className="text-red-500 text-sm mt-1">{formErrors.quantity}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block mb-2 text-sm text-gray-900 dark:text-white">Description</label>
          <textarea
            id="description"
            rows="4"
            name="description"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500 resize-none"
            placeholder="Describe your items..."
            value={formValue.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div>
          <label htmlFor="deadline" className="block mb-2 text-sm text-gray-900 dark:text-white">Deadline</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
            value={formValue.deadline}
            onChange={handleChange}
          />
          {formErrors.deadline && <p className="text-red-500 text-sm mt-1">{formErrors.deadline}</p>}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 flex items-center"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default RFQsForm;
