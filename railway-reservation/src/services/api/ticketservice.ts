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

export const submitTicketForm = async (trainId: number, formData: any) => {
    const token = getToken();
    const response = await axios.post(`${API_URL}/tickets/book/${trainId}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

