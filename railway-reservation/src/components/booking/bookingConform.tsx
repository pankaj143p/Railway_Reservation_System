import { useEffect, useState } from "react";
import { UserFormProps } from "../../interfaces/form";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { jwtDecode } from "jwt-decode";
import Toast from "../common/Toast";
import { useToast } from "../../hooks/useToast";


declare global {
  interface Window {
    Razorpay: any;
  }
}

const API_URL = import.meta.env.VITE_API_GATEWAY_URL;
const RAZOR_KEY = import.meta.env.VITE_RAZORPAY_KEY;
const TicketConfirm = ({ onSubmit }: UserFormProps) => {
  const { trainId } = useParams<{ trainId: string }>();
  // const { userId } = useParams<{ userId: string }>();
 const token = localStorage.getItem("token");
  const { toast, showToast, hideToast } = useToast();
  let userEmail: string | undefined = undefined;
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      userEmail = decoded.userId || decoded.id || decoded.sub; // depends on your backend JWT claims
      console.log("Decoded userEmail:", userEmail);
    } catch (e) {
      userEmail = undefined;
    }
  }
  

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    trainId: trainId,
    fullName: "",
    seatCount: "",
    age: "",
    email: "",
    amount: ""
  });
  const [baseAmount, setBaseAmount] = useState<number>(0);
  const [availableSeats, setAvailableSeats] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSeatAlert, setShowSeatAlert] = useState(false);
  const [searchParams] = useSearchParams();
  const selectedDate = searchParams.get("date") || undefined;

  // Validate 90-day booking rule
  useEffect(() => {
    if (selectedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const travelDate = new Date(selectedDate);
      travelDate.setHours(0, 0, 0, 0);
      const maxBookingDate = new Date(today);
      maxBookingDate.setDate(maxBookingDate.getDate() + 90);
      maxBookingDate.setHours(0, 0, 0, 0);

      console.log(`Booking validation: Travel date: ${selectedDate}, Today: ${today.toISOString().split('T')[0]}, Max booking: ${maxBookingDate.toISOString().split('T')[0]}`);

      if (travelDate.getTime() < today.getTime()) {
        showToast(" Cannot book past dates. Please select a valid travel date.", "error");
        navigate("/trains");
        return;
      }

      if (travelDate.getTime() > maxBookingDate.getTime()) {
        showToast(` Booking not available beyond 90 days from today. Maximum booking date is ${maxBookingDate.toISOString().split('T')[0]}`, "error");
        navigate("/trains");
        return;
      }
    }
  }, [selectedDate, navigate, showToast]);

  useEffect(() => {
    if (trainId) {
      const token = localStorage.getItem("token");
      axios.get(`${API_URL}/trains/get/${trainId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => {
          const data = res.data;
          if (data && data.amount) {
            setBaseAmount(Number(data.amount));
            console.log(data);
            
            setFormData(prev => ({
              ...prev,
              amount: data.amount.toString()
            }));
            console.log(data.totalSeats
);
            
            setAvailableSeats(data.totalSeats
 || 0); 
          } else {
            setError("Train details not found.");
          }
        })
        .catch(err => {
          setError("Failed to fetch train details.");
          showToast("Please login first before booking a ticket", "error");
          console.log("Error fetching train details:", err);
          
        });
    }
  }, [trainId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    if (name === "seatCount") {
      const seatCountNum = value === "" ? 0 : parseInt(value);
      newFormData.amount = (baseAmount * seatCountNum).toString();

      if (value !== "" && seatCountNum > availableSeats && seatCountNum > 0) {
        setShowSeatAlert(true);
      } else {
        setShowSeatAlert(false);
      }
    }
    setFormData(newFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.seatCount) {
      setError("Please fill all required fields!");
      return;
    }

    if (parseInt(formData.seatCount) > availableSeats) {
      setShowSeatAlert(true);
      setError("Cannot book more seats than available.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const amount = parseInt(formData.seatCount) * baseAmount;

      // Step 1: create Razorpay order
      const orderRes = await axios.post(
        `${API_URL}/createOrder?amount=${amount*100}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "text"
        }
      );
      const orderId = orderRes.data;

      const options = {
        key: RAZOR_KEY,
        amount : amount,
        currency: "INR",
        name: "Train Ticket Booking",
        description: "Booking Payment",
        order_id: orderId,
        
        handler: async (response: any) => {
          try {
            const updatedFormData = {
              ...formData,
              orderId: orderId,
              paymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              userEmail: userEmail,
              date: selectedDate || new Date().toISOString().split('T')[0] 
            };
            console.log("Booking data to send:", updatedFormData);
            
            const verifyRes = await axios.post(
              `${API_URL}/tickets/book/${trainId}`,
              updatedFormData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            try {
              await onSubmit(verifyRes.data);
              setSuccess("Ticket booked successfully!");
              navigate(`/confirmed/${orderId}`)
            } catch (submitErr) {
              setError("Ticket booked, but post-booking action failed.");
              setSuccess("");
            }
          } catch (err) {
            setError("Error booking ticket. Please try again.");
            setSuccess("");
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

      if (window.Razorpay) {
        const razor = new window.Razorpay(options);
        razor.open();
      } else {
        setError("Payment gateway failed to load. Please refresh and try again.");
      }
    } catch (err) {
      setError("Payment or booking error.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledWrapper>
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={hideToast}
      />
      <div className="container">
        <form className="form" onSubmit={handleSubmit} autoComplete="off">
          <h2 className="form-title">Book Your Ticket</h2>
          {selectedDate && (
            <div className="selected-date">
              <span>Travel Date: <strong>{new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</strong></span>
            </div>
          )}
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          {showSeatAlert && (
            <div className="seat-alert">
              <span>
                Only <b>{availableSeats}</b> seats available. Please reduce seat count.
              </span>
            </div>
          )}

          <div className="input-block">
            <input
              className="input"
              type="text"
              name="fullName"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            <label htmlFor="fullName">Full Name</label>
          </div>
          <div className="input-block">
            <input
              className="input"
              type="number"
              name="seatCount"
              id="seatCount"
              value={formData.seatCount}
              onChange={handleChange}
              required
              min={1}
              autoComplete="off"
            />
            <label htmlFor="seatCount">Seat Count</label>
          </div>
          <div className="input-block">
            <input
              className="input"
              type="number"
              name="age"
              id="age"
              value={formData.age}
              onChange={handleChange}
              required
              min={0}
              autoComplete="off"
            />
            <label htmlFor="age">Age</label>
          </div>
          <div className="input-block">
            <input
              className="input"
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="input-block">
            <input
              className="input"
              type="text"
              name="amount"
              id="amount"
              value={formData.amount}
              readOnly
              disabled
            />
            <label htmlFor="amount"></label>
          </div>
          <div className="input-block">
            <button
              type="submit"
              disabled={
                loading ||
                showSeatAlert ||
                !formData.seatCount ||
                parseInt(formData.seatCount) < 1
              }
            >
              {loading ? "Processing..." : "Pay&Book"}
            </button>
          </div>
        </form>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container {
    display: flex;
    width: 420px;
    max-width: 99%;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    background-color: #ffffff25;
    border-radius: 15px;
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.03);
    border: 0.1px solid rgba(128, 128, 128, 0.178);
    margin: 40px auto;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    width: 100%;
    left: 0;
    backdrop-filter: blur(20px);
    position: relative;
    padding: 32px 0;
  }

  .form-title {
    text-align: center;
    font-size: 1.6em;
    font-weight: 600;
    color: #425981;
    margin-bottom: 18px;
  }

  .input-block {
    position: relative;
    margin-bottom: 18px;
  }

  .input,
  button {
    background: rgba(253, 253, 253, 0);
    outline: none;
    border: 1px solid rgba(255, 0, 0, 0);
    border-radius: 0.5rem;
    padding: 10px;
    margin: 10px auto;
    width: 80%;
    display: block;
    color: #425981;
    font-weight: 500;
    font-size: 1.1em;
  }

  label {
    position: absolute;
    left: 15%;
    top: 37%;
    pointer-events: none;
    color: gray;
    transition: all 0.4s;
  }

  .input:focus + label,
  .input:valid + label {
    transform: translateY(-120%) scale(0.9);
    color: #5e7eb6;
  }

  button {
    background-color: #5e7eb6;
    color: white;
    font-size: medium;
    box-shadow: 2px 4px 8px rgba(70, 70, 70, 0.178);
    cursor: pointer;
    transition: background 0.2s;
  }
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error {
    color: #e53e3e;
    text-align: center;
    margin-bottom: 10px;
  }
  .success {
    color: #22c55e;
    text-align: center;
    margin-bottom: 10px;
  }

  .input {
    box-shadow: inset 4px 4px 4px rgba(165, 163, 163, 0.315),
      4px 4px 4px rgba(218, 218, 218, 0.13);
  }

  .seat-alert {
    background: #fff3cd;
    color: #856404;
    border: 1px solid #ffeeba;
    border-radius: 6px;
    padding: 10px;
    margin-bottom: 10px;
    text-align: center;
    font-size: 1em;
  }

  .selected-date {
    background: #e7f3ff;
    color: #2563eb;
    border: 1px solid #bfdbfe;
    border-radius: 6px;
    padding: 10px;
    margin-bottom: 10px;
    text-align: center;
    font-size: 1em;
  }
    `;

export default TicketConfirm;