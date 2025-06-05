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



// import { useParams } from "react-router-dom";
// import { useEffect } from "react";
// import TicketForm from "../../components/ui/form";
// import handlePayment from "../../utils/handleConfirmPayment";
// const BookTrain = () => {
//     const { trainId } = useParams();
//     console.log("Train ID:", trainId);
//     useEffect(() =>{
       
//     })
//   return (
      
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Book Your Train</h1>
//       <p className="text-lg">You're booking train ID: <strong>{trainId}</strong></p>
//       <div>
//         {/* <TicketForm onSubmit={function (formData: { fullName: string; seatCount: string; age: string; email: string; date: string; }): void {
//           console.log("Form Data Submitted:", formData);
//         }}/> */}
//         <TicketForm onSubmit={async (formData) => {
//           console.log("Form Data Submitted:", formData);
//           if (trainId) {
//             await handlePayment(formData, Number(trainId));
//           } else {
//             console.error("Train ID is not available");
//           }
//         }
//         } />
//       </div>
//     </div>
//   );
// };

// export default BookTrain;


// import { useParams } from "react-router-dom";
// import { useEffect } from "react";
// import TicketForm from "../../components/ui/form";
// import handlePayment from "../../utils/handleConfirmPayment";

// const BookTrain = () => {
//     const { trainId } = useParams();
//     console.log("Train ID:", trainId);

//     useEffect(() => {
//         // Any initialization logic if needed
//     }, []);

//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
//             <h1 className="text-3xl font-bold text-gray-800 mb-6">Book Your Train</h1>
//             <p className="text-lg">You're booking train ID: <strong>{trainId}</strong></p>
//             <div>
//                 <TicketForm onSubmit={async (formData) => {
//                     console.log("Form Data Submitted:", formData);
//                     if (trainId) {
//                         await handlePayment(formData, Number(trainId));
//                     } else {
//                         console.error("Train ID is not available");
//                     }
//                 }} />
//             </div>
//         </div>
//     );
// };

// export default BookTrain;




import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function BookTrain() {
  const { trainid } = useParams();
  const [seatcount, setSeatcount] = useState("1");

  // Load Razorpay script
  const loadRazorpayScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  };

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  // Click "Book Now"
  const handleBookClick = async () => {
    const amount = 500; // Rs 5.00
    try {
      const res = await fetch(`http://localhost:5110/createOrder?amount=${amount}`);
      const orderId = await res.text();

      if (orderId) {
        openRazorpay(orderId, amount);
      } else {
        alert("❌ Order creation failed");
      }
    } catch (error) {
      alert("❌ Error while creating order");
    }
  };

  // Open Razorpay payment popup
  const openRazorpay = (orderId: string, amount: number) => {
    const options = {
      key: "rzp_test_osVJC0WK6xlISp", // Replace with your Razorpay key
      amount: amount,
      currency: "INR",
      name: "Railway Reservation",
      description: "Train Ticket Booking",
      order_id: orderId,
      handler: function (response: any) {
        handlePaymentSuccess(response);
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#0f172a",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // After successful payment
  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      const res = await fetch(`http://localhost:5100/tickets/book/${trainid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trainId: trainid,
          seatCount: seatcount,
          razorpayOrderId: paymentData.razorpay_order_id,
          razorpayPaymentId: paymentData.razorpay_payment_id,
          razorpaySignature: paymentData.razorpay_signature,
          passengerName: "Test Passenger",
        }),
      });

      if (res.ok) {
        alert("✅ Ticket booked successfully!");
      } else {
        alert("❌ Ticket booking failed after payment.");
      }
    } catch (error) {
      alert("❌ Error sending booking data to backend.");
    }
  };

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Book Your Train</h1>
      <p className="mb-4">Train ID: <strong>{trainid}</strong></p>

      <label className="mb-2">
        Seat Count:
        <input
          type="number"
          value={seatcount}
          onChange={(e) => setSeatcount(e.target.value)}
          className="border p-1 ml-2"
        />
      </label>

      <button
        onClick={handleBookClick}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Book Now
      </button>
    </div>
  );
}

export default BookTrain;