import React, { useState, useEffect } from "react";
import axios from "axios";
import Heading from "../components/Heading";
import InputBox from "../components/InputBox";
import Button from "../components/Button";

const ClientRFQ = () => {
  const [rfqs, setRFQs] = useState([]);
  const [formData, setFormData] = useState({
    productOrService: "",
    quantity: "",
    description: "",
    deadline: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 📌 Fetch RFQs
  // const fetchRFQs = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.get("http://localhost:3000/api/v1/rfq/my-rfqs", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setRFQs(response.data.rfqs);
  //   } catch (error) {
  //     console.error("Error fetching RFQs:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchRFQs();
  // }, []);

  // 📌 Handle Form Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📌 Submit RFQ
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/api/v1/rfq/submit", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormData({ productOrService: "", quantity: "", description: "", deadline: "" });
      fetchRFQs();
    } catch (error) {
      setError(error.response?.data?.msg || "Failed to submit RFQ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Heading title="Submit RFQ" />
      {error && <p className="text-red-500">{error}</p>}

      {/* RFQ Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow-md">
        <InputBox title="Product/Service" type="text" name="productOrService" value={formData.productOrService} onChange={handleChange} />
        <InputBox title="Quantity" type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
        <InputBox title="Description" type="text" name="description" value={formData.description} onChange={handleChange} />
        <InputBox title="Deadline" type="date" name="deadline" value={formData.deadline} onChange={handleChange} />

        <Button title={loading ? "Submitting..." : "Submit RFQ"} type="submit" disabled={loading} />
      </form>

      {/* RFQ List */}
      <div className="mt-6">
        <Heading title="Your RFQs" />
        {rfqs.length === 0 ? (
          <p className="text-gray-500">No RFQs submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {rfqs.map((rfq) => (
              <div key={rfq._id} className="border p-4 rounded-lg bg-white shadow-md">
                <p className="font-semibold">{rfq.productOrService}</p>
                <p>Quantity: {rfq.quantity}</p>
                <p className="text-gray-500">Status: {rfq.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientRFQ;
