const API_URL = import.meta.env.VITE_API_GATEWAY_URL;
const getToken =()=> localStorage.getItem("token");
import axios from "axios";
import TicketResponse from "../../interfaces/ticket"

export const fetchBookedTicket = async (): Promise<TicketResponse[]> => {
	const token = getToken();
    const response = await axios.get<TicketResponse[]>(`${API_URL}/tickets/all`,{
        headers : {
            Authorization: `Bearer ${token}`
        }
    })
	return response.data;
}

