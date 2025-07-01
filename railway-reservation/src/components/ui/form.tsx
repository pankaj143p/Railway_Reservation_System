import { useState } from "react";
import { UserFormProps } from "../../interfaces/form";
import { submitTicketForm } from "../../services/api/ticketservice";

import { useParams } from "react-router-dom";

/*
    private Long trainId;
    private String fullName;
    private Integer seatCount;
    private int age;
    private String email;
    private LocalDateTime date;
  */
const TicketForm: React.FC<UserFormProps> = ({ onSubmit }) => {
  const {trainId} = useParams<{trainId: string}>();
  const [formData, setFormData] = useState({
    trainId: trainId,
    fullName: "",
    seatCount: "",
    age: "",
    email: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.date) {
      setError("Please fill all required fields!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await submitTicketForm(Number(trainId), formData);
      setSuccess("Form submitted successfully!");
      onSubmit(response);
    } catch (err) {
      setError("Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Book Your Ticket</h2>
      
      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400" />
        <input type="number" name="seatCount" value={formData.seatCount} onChange={handleChange} placeholder="Seat Count" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400" />
        <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400" />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400" />
        <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400" />
        
        <button type="submit" className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default TicketForm;