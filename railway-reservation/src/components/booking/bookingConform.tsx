import { useState } from "react";
import { UserFormProps } from "../../interfaces/form";
import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// const navigator = useNavigate();

declare global {
  interface Window {
    Razorpay: any;
  }
}

const TicketConfirm = ({ onSubmit }: UserFormProps) => {
  const { trainId } = useParams<{ trainId: string }>();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.date || !formData.seatCount) {
      setError("Please fill all required fields!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const amount = parseInt(formData.seatCount) * 140 * 100; // ₹140 per seat

      // Step 1: create Razorpay order
      const orderRes = await fetch(
        `http://localhost:6111/payment/createOrder?amount=${amount}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const orderData = await orderRes.json();

      const options = {
        key: "rzp_test_osVJC0WK6xlISp", // replace with your test key
        amount,
        currency: "INR",
        name: "Train Ticket Booking",
        description: "Booking Payment",
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            const updatedFormData = {
              ...formData,
              orderId: orderData.id,
              paymentId: response.razorpay_payment_id,
              razorSignature: response.razorpay_signature,
            };
            const verifyRes = await fetch(
              `http://localhost:6111/tickets/book/${trainId}`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFormData),
              }
            );
            const result = await verifyRes.json();
            setSuccess("Ticket booked successfully!");
            onSubmit(result);
            // navigator("/confirmed"); 
          } catch (err) {
            console.error("Booking error:", err);
            // setError("Error booking ticket. Please try again.");
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error(err);
      setError("Payment or booking error.");
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
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="w-full p-2 border border-gray-300 rounded" />
        <input type="number" name="seatCount" value={formData.seatCount} onChange={handleChange} placeholder="Seat Count" className="w-full p-2 border border-gray-300 rounded" />
        <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" className="w-full p-2 border border-gray-300 rounded" />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border border-gray-300 rounded" />
        <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />

        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Book & Pay"}
        </button>
      </form>
    </div>
  );
};

export default TicketConfirm;


