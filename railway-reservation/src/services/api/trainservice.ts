import axios from "axios";
import { Train, SeatClassConfig } from "../../interfaces/Train";

const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

const getToken = () => localStorage.getItem("token");

export const fetchTrains = async (): Promise<Train[]> => {
    const token = getToken();
    const response = await axios.get<Train[]>(`${API_URL}/trains/all`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const addTrain = async (train: Partial<Train>): Promise<Train> => {
    const token = getToken();
    const response = await axios.post(`${API_URL}/trains/add`, train, {
        headers: { Authorization: `Bearer ${token}` }
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

export const updateTrain = async (id: number, train: Partial<Train>): Promise<Train> => {
    const token = getToken();
    const response = await axios.put(`${API_URL}/trains/update/${id}`, train, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

// New admin endpoints for seat class management
export const getSeatConfiguration = async (trainId: number): Promise<any> => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/trains/${trainId}/seat-config`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

export const updateSeatConfiguration = async (trainId: number, config: SeatClassConfig): Promise<Train> => {
    const token = getToken();
    const response = await axios.put(
        `${API_URL}/trains/${trainId}/admin/seat-config`, 
        config,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return response.data;
}

export const resetSeatConfiguration = async (trainId: number, totalSeats: number): Promise<Train> => {
    const token = getToken();
    const response = await axios.put(
        `${API_URL}/trains/${trainId}/admin/reset-seats?totalSeats=${totalSeats}`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return response.data;
}

export const getSeatClassAnalytics = async (trainId: number, date: string): Promise<any> => {
    const token = getToken();
    const response = await axios.get(
        `${API_URL}/trains/${trainId}/admin/seat-analytics?date=${date}`,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return response.data;
}

export const getTrainSeatOverview = async (): Promise<any[]> => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/trains/admin/seat-overview`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

// Individual seat/pricing update endpoints for granular control
export const updateSeatCounts = async (
    trainId: number, 
    sleeperSeats: number, 
    ac2Seats: number, 
    ac1Seats: number
): Promise<Train> => {
    const token = getToken();
    const response = await axios.put(
        `${API_URL}/trains/${trainId}/seat-config?sleeperSeats=${sleeperSeats}&ac2Seats=${ac2Seats}&ac1Seats=${ac1Seats}`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return response.data;
}

export const updatePricing = async (
    trainId: number, 
    sleeperPrice: number, 
    ac2Price: number, 
    ac1Price: number
): Promise<Train> => {
    const token = getToken();
    const response = await axios.put(
        `${API_URL}/trains/${trainId}/pricing?sleeperPrice=${sleeperPrice}&ac2Price=${ac2Price}&ac1Price=${ac1Price}`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return response.data;
}

