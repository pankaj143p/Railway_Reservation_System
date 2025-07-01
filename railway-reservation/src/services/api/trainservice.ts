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


// export const addUser = async (user: Partial<User>): Promise<User> => {
//   const token = getToken();
//   const res = await axios.post(`${API_URL}/register`, user, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   return res.data;
// };

export const addTrain = async (train: Partial<Train>): Promise<Train> =>{
    const token = getToken();
    const response = await axios.post(`${API_URL}/add`, train, {
        headers: {Authorization : `Bearer ${token}`}
    });
    return response.data;
}

export const deleteTrain = async (id: number): Promise<void> => {
    const token = getToken();
    await axios.delete(`${API_URL}/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const updateTrain = async(id: number, train: Partial<Train>): Promise<Train> =>{
    const token = getToken();
    const response = await axios.put(`${API_URL}/update/${id}`, train, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

