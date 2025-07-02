import axios from "axios";

const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

export interface CancellationResponse {
  message: string;
  refundProcessed: boolean;
  refundId?: string;
  refundAmount?: number;
  originalAmount?: number;
  cancellationFee?: number;
  refundStatus?: string;
  expectedRefundTime?: string;
}

export const cancelTicketWithRefund = async (ticketId: number): Promise<CancellationResponse> => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error("No authentication token found.");
  }

  try {
    const response = await axios.put(
      `${API_URL}/tickets/cancel-with-refund/${ticketId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error cancelling ticket:", error);
    if (error.response?.data) {
      throw new Error(error.response.data);
    }
    throw new Error("Failed to cancel ticket. Please try again.");
  }
};

export const cancelTicket = async (ticketId: number): Promise<string> => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error("No authentication token found.");
  }

  try {
    const response = await axios.put(
      `${API_URL}/tickets/cancel/${ticketId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error cancelling ticket:", error);
    if (error.response?.data) {
      throw new Error(error.response.data);
    }
    throw new Error("Failed to cancel ticket. Please try again.");
  }
};
