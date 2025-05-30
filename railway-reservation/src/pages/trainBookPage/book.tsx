// import { useState } from "react";

// declare global {
//     interface Window {
//         Razorpay: any;
//     }
// }

// const TicketBooking = () => {
//     const [ticketDetails, setTicketDetails] = useState({
//         trainId: "",
//         fullName: "",
//         age: "",
//         seatCount: "",
//         email: ""
//     });

//     const handleChange = (e: { target: { name: any; value: any; }; }) => {
//         setTicketDetails({ ...ticketDetails, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e: { preventDefault: () => void; }) => {
//         e.preventDefault();

//         try {
//             const amount = Number(ticketDetails.seatCount) * 10 * 140; // Amount in paise
//             const response = await fetch(`http://localhost:6111/createOrder?amount=${amount}`);
//             const orderId = await response.text(); // Get order ID from the backend

//             if (orderId && orderId.includes("order_")) {
//                 const options = {
//                     key: "rzp_test_osVJC0WK6xlISp", // Replace with your Razorpay key
//                     amount: amount,
//                     currency: "INR",
//                     name: "Train Ticket Booking",
//                     description: "Book Your Train Ticket",
//                     order_id: orderId,
//                     handler: async (response: { razorpay_payment_id: any; razorpay_signature: any; }) => {
//                         const paymentDetails = {
//                             orderId: orderId,
//                             paymentId: response.razorpay_payment_id,
//                             razorpaySign: response.razorpay_signature
//                         };

//                         const verifyResponse = await fetch("http://localhost:6111/verify", {
//                             method: "POST",
//                             headers: { "Content-Type": "application/x-www-form-urlencoded" },
//                             body: new URLSearchParams(paymentDetails)
//                         });

//                         alert(await verifyResponse.text());
//                     },
//                     theme: { color: "#3399cc" }
//                 };

//                 const rzp = new window.Razorpay(options);
//                 rzp.open();
//             } else {
//                 alert("Failed to create order, try again later.");
//             }
//         } catch (error) {
//             console.error("Error creating order:", error);
//             alert("An error occurred. Please try again.");
//         }
//     };

//     return (
//         <div>
//             <h2>Book Your Train Ticket</h2>
//             <form onSubmit={handleSubmit}>
//                 <label>Train ID:</label>
//                 <input type="number" name="trainId" value={ticketDetails.trainId} onChange={handleChange} required />
//                 <br /><br />

//                 <label>Full Name:</label>
//                 <input type="text" name="fullName" value={ticketDetails.fullName} onChange={handleChange} required />
//                 <br /><br />

//                 <label>Age:</label>
//                 <input type="number" name="age" value={ticketDetails.age} onChange={handleChange} required />
//                 <br /><br />

//                 <label>No of Seats:</label>
//                 <input type="number" name="seatCount" value={ticketDetails.seatCount} onChange={handleChange} required />
//                 <br /><br />

//                 <label>Email:</label>
//                 <input type="email" name="email" value={ticketDetails.email} onChange={handleChange} required />
//                 <br /><br />

//                 <button type="submit">Book Ticket</button>
//             </form>
//         </div>
//     );
// };

// export default TicketBooking;



import { useParams } from "react-router-dom";
import { useEffect } from "react";
import TicketForm from "../../components/ui/form";
const BookTrain = () => {
    const { trainId } = useParams();
    console.log("Train ID:", trainId);
    useEffect(() =>{
       
    })
  return (
      
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Book Your Train</h1>
      <p className="text-lg">You're booking train ID: <strong>{trainId}</strong></p>
      <div>
        <TicketForm onSubmit={function (formData: { fullName: string; seatCount: string; age: string; email: string; date: string; }): void {
          console.log("Form Data Submitted:", formData);
        }}/>
      </div>
    </div>
  );
};

export default BookTrain;