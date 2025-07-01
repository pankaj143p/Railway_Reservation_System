// import axios from "axios";

// declare global {
//     interface Window {
//         Razorpay: any;
//     }
// }

// type FormData = {
//     fullName : string;
//     email: string;
//     age: string;
//     seatCount: string;
//     date: string;
// }

// const handlePayment= async(formData:FormData, trainId : number)=>{
//     try {
//         const token = localStorage.getItem("token");
//         const amount = parseInt(formData.seatCount) * 100 * 150;
//         const orderResponse = await axios.post(
//             `http://localhost:6111/createOrder${amount}`,
//             {},
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );
//         const orderData: {
//             id : String
//         } = JSON.parse(orderResponse.data);
//         const orderId = orderData.id;
//         const optuns = {
//             key : "rzp_test_osVJC0WK6xlISp",
//             amount: amount,  // Amount in paise    
//             currency: "INR",
//             name: "Train Ticket Booking",
//             Description: "Book your train tickets with ease",
//             order_Id : orderId,
//             handler : async (response: any) => {
//                 const paymentId = response.razorpay_payment_id;
//                 const razorSignature = response.razorpay_signature;

//                 const verifyResponse = await axios.post(
//                     "http://localhost:6111/verify",
//                     {
//                         ...formData,
//                         orderId: orderId,
//                         paymentId: paymentId,
//                         razorSignature: razorSignature,
//                     },
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                             "Content-Type": "application/json",
//                         },
//                     }
//                 );

//                 alert("Ticket booked successfully!");
//                 console.log("Payment verification response:", verifyResponse.data);


//             },
//             prefill: {
//                 name: formData.fullName,
//                 email: formData.email,
//             },
//             theme: {
//                 color: "#3399cc",
//             },
//         };
//         const rzp = new window.Razorpay(optuns);
//         rzp.open();
//     } catch (error) {
//         console.error("Error during payment process:", error);
//         alert("Payment failed. Please try again.");
//       }
//     };

// export default handlePayment;


import axios from "axios";

declare global {
    interface Window {
        Razorpay: any;
    }
}

type FormData = {
    fullName: string;
    email: string;
    age: string;
    seatCount: string;
    date: string;
}

const handlePayment = async (formData: FormData, trainId: number) => {
    try {
        const token = localStorage.getItem("token");
        const amount = parseInt(formData.seatCount) * 100 * 150;
        const orderResponse = await axios.post(
            `http://localhost:6111/createOrder${amount}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const orderData: { id: String } = orderResponse.data;
        const orderId = orderData.id;
        const options = {
            key: "rzp_test_osVJC0WK6xlISp",
            amount: amount,  // Amount in paise    
            currency: "INR",
            name: "Train Ticket Booking",
            description: "Book your train tickets with ease",
            order_id: orderId,
            handler: async (response: any) => {
                const paymentId = response.razorpay_payment_id;
                const razorSignature = response.razorpay_signature;

                try {
                    const verifyResponse = await axios.post(
                        "http://localhost:6111/verify",
                        {
                            ...formData,
                            orderId: orderId,
                            paymentId: paymentId,
                            razorSignature: razorSignature,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    // Save ticket to database after successful payment verification
                    const ticketResponse = await axios.post(
                        "http://localhost:6111/bookTicket",
                        {
                            trainId: trainId,
                            ...formData,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    alert("Ticket booked successfully!");
                    console.log("Ticket booking response:", ticketResponse.data);
                } catch (error) {
                    console.error("Error during payment verification or ticket booking:", error);
                    alert("Payment verification failed. Please try again.");
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
        const rzp = new window.Razorpay(options);
        rzp.open();
    } catch (error) {
        console.error("Error during payment process:", error);
        alert("Payment failed. Please try again.");
    }
};

export default handlePayment;
