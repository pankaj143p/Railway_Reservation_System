import axios from "axios";
import { Train } from "../../interfaces/Train";

const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

const getToken =()=> localStorage.getItem("token");
export const fetchTrains = async (): Promise<Train[]> =>{
    const token = getToken();
	const response = await axios.get<Train[]>(`${API_URL}/trains/all`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data;
}  


export const addTrain = async (train: Partial<Train>): Promise<Train> =>{
    const token = getToken();
    const response = await axios.post(`${API_URL}/trains/add`, train, {
        headers: {Authorization : `Bearer ${token}`}
    });
    return response.data;
}

export const deleteTrain = async (id: number): Promise<boolean> => {
    const token = getToken();
    if (!token) {
        throw new Error("No authentication token found");
    }
    
    try {
        const response = await axios.put(`${API_URL}/trains/toggle-active/${id}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data; 
    } catch (error) {
        console.error("Error toggling train status:", error);
        throw error;
    }
};


export const updateTrain = async(id: number, train: Partial<Train>): Promise<Train> =>{
    const token = getToken();
    const response = await axios.put(`${API_URL}/trains/update/${id}`, train, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

