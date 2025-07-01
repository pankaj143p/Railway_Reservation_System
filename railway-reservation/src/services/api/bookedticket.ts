import axios from "axios";

const token = localStorage.getItem("token");
const API_URL = import.meta.env.VITE_API_GATEWAY_URL;
const fetchBookedTicketByOrderId = async (orderId : string) =>{
    try {
       if(!token){
        throw new Error("No authentication token found.");
       }
       
       const res = await axios.get(`${API_URL}/tickets/order/${orderId}`,{
        headers : { Authorization: `Bearer ${token}`},
        withCredentials: true
       })
       return res.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return null;
    }
}

export default fetchBookedTicketByOrderId