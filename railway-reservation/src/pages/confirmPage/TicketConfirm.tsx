// import React from 'react';
// import TicketForm from '../../components/ui/form';



import { useState } from "react";

// Add Razorpay type to the window object
declare global {
    interface Window {
        Razorpay: any;
    }
}

const Payment = () => {
    const [seatCount, setSeatCount] = useState<number>(0);
    const amount = seatCount * 140 * 100; // Convert ₹140 per seat to paise

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSeatCount(Number(e.target.value)); // Convert input to number
    };

    const handlePayment = async () => {
        try {
            const response = await fetch(`http://localhost:5110/createOrder?amount=${amount}`);
            const orderId = await response.text();

            if (orderId && orderId.includes("order_")) {
                const options = {
                    key: "rzp_test_osVJC0WK6xlISp", // Replace with your Razorpay key
                    amount: amount, // Total amount in paise
                    currency: "INR",
                    name: "Train Ticket Booking",
                    description: "Book Your Train Ticket",
                    order_id: orderId,
                    handler: async function (response: any) {
                        await verifyPayment(orderId, response);
                    },
                    theme: { color: "#3399cc" }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                alert("Failed to create order, try again later.");
            }
        } catch (error) {
            console.error("Error creating order:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const verifyPayment = async (orderId: string, response: any) => {
        try {
            const verifyResponse = await fetch("http://localhost:5110/verify", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    orderId: orderId,
                    paymentId: response.razorpay_payment_id,
                    razorpaySign: response.razorpay_signature
                })
            });

            const verifyData = await verifyResponse.text();
            alert(verifyData);
        } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Payment verification error!");
        }
    };

    return (
        <div className="container">
            <h2>Book Your Train Ticket</h2>
            <input type="number" value={seatCount} onChange={handleChange} placeholder="Enter seat count" required />
            <p>Total Amount: ₹{seatCount * 140}</p>
            <button onClick={handlePayment}>Proceed to Pay</button>
        </div>
    );
};

export default Payment;




// const TicketConfirm = () => {
//   const [seatCount, setSeatCount] = React.useState(0);
//   <TicketForm onSubmit={function (formData: { fullName: string; seatCount: string; age: string; email: string; date: string; }): void {
//    setSeatCount(Number(formData.seatCount));
//   }}/>
//   let amount = 300*seatCount;
  
//   return (
//    <>
//      <div>

//      </div>
//    </>
//   );
// }

// export default TicketConfirm;

