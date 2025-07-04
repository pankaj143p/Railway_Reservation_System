import { Train, TrainSchedule, TrainSearchParams } from '../interfaces/Train';

// Microservices endpoints
const TRAIN_SERVICE_URL = import.meta.env.VITE_API_GATEWAY_URL;

export const fetchTrainList = async () => {
  try {
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   throw new Error("No authentication token found.");
    // }

    const response = await fetch(`${TRAIN_SERVICE_URL}/trains/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
        // Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("datat ", data);
    
    // Filter trains to show only those available within 90 days
    return filterTrainsBy90DayRule(data);
  } catch (error) {
    console.error("Error fetching train list:", error);
    return null;
  }
};

// Fetch trains for public listing (only available trains within 90 days)
export const fetchAvailableTrains = async () => {
  try {
    const response = await fetch(`${TRAIN_SERVICE_URL}/trains/available`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {
      // Fallback to all trains if specific endpoint doesn't exist
      return fetchTrainList();
    }

    const data = await response.json();
    console.log("Available trains data: ", data);
    
    return filterTrainsBy90DayRule(data);
  } catch (error) {
    console.error("Error fetching available trains, falling back to all trains:", error);
    return fetchTrainList();
  }
};

// Utility function to filter trains by 90-day rule
const filterTrainsBy90DayRule = (trains: Train[]) => {
  if (!Array.isArray(trains)) return [];
  
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 90);
  
  return trains.filter(train => {
    // Check if train has any availability within the next 90 days
    // Show trains that are available, on time, or operational
    const validStatuses = ['ON_TIME', 'AVAILABLE', 'OPERATIONAL', 'RUNNING'];
    const trainStatus = train.status?.toUpperCase();
    
    // Filter out cancelled, maintenance, or not available trains
    const invalidStatuses = ['CANCELLED', 'MAINTENANCE', 'NOT_AVAILABLE', 'SUSPENDED'];
    
    if (invalidStatuses.some(status => trainStatus?.includes(status))) {
      return false;
    }
    
    // Include trains with valid operational status
    return validStatuses.some(status => trainStatus?.includes(status)) || !trainStatus;
  });
};

// Check if a train is bookable within 90 days
export const isTrainBookableWithin90Days = (trainDate: string): boolean => {
  const today = new Date();
  const bookingDate = new Date(trainDate);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 90);
  
  today.setHours(0, 0, 0, 0);
  bookingDate.setHours(0, 0, 0, 0);
  maxDate.setHours(0, 0, 0, 0);
  
  return bookingDate >= today && bookingDate <= maxDate;
};

// Get available booking dates for a train (up to 90 days)
export const getAvailableBookingDates = (): { start: string; end: string } => {
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 90);
  
  return {
    start: today.toISOString().split('T')[0],
    end: maxDate.toISOString().split('T')[0]
  };
};

// Validate booking request against 90-day rule
export const validateBookingDate = (bookingDate: string): { valid: boolean; message: string } => {
  const today = new Date();
  const booking = new Date(bookingDate);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 90);
  
  today.setHours(0, 0, 0, 0);
  booking.setHours(0, 0, 0, 0);
  maxDate.setHours(0, 0, 0, 0);
  
  if (booking < today) {
    return { valid: false, message: "Cannot book past dates" };
  }
  
  if (booking > maxDate) {
    return { valid: false, message: "Booking not available beyond 90 days from today" };
  }
  
  return { valid: true, message: "Date is valid for booking" };
};

// Search trains with date range support
export const searchTrains = async (searchParams: TrainSearchParams): Promise<TrainSchedule[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found.");
    }

    const queryParams = new URLSearchParams({
      source: searchParams.source,
      destination: searchParams.destination,
      fromDate: searchParams.fromDate,
      ...(searchParams.toDate && { toDate: searchParams.toDate }),
      ...(searchParams.passengers && { passengers: searchParams.passengers.toString() })
    });

    const response = await fetch(`${TRAIN_SERVICE_URL}/trains/search/advanced?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching trains:", error);
    throw error;
  }
};

// Get train schedule for specific date range
export const getTrainSchedule = async (trainId: number, fromDate: string, toDate?: string): Promise<TrainSchedule[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found.");
    }

    const queryParams = new URLSearchParams({
      fromDate,
      ...(toDate && { toDate })
    });

    const response = await fetch(`${TRAIN_SERVICE_URL}/trains/${trainId}/schedule?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching train schedule:", error);
    throw error;
  }
};

// Get available seats for specific train and date
export const getAvailableSeats = async (trainId: number, date: string): Promise<number> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found.");
    }

    const response = await fetch(`${TRAIN_SERVICE_URL}/trains/${trainId}/seats/${date}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.availableSeats;
  } catch (error) {
    console.error("Error fetching available seats:", error);
    throw error;
  }
};

// Utility function to generate date range
export const generateDateRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    dates.push(dt.toISOString().split('T')[0]);
  }
  
  return dates;
};

// Get available dates for a train (up to 3 months from today)
export const getAvailableDates = (train: Train, monthsAhead: number = 3): string[] => {
  const today = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + monthsAhead);
  
  const availableDates: string[] = [];
  
  for (let dt = new Date(today); dt <= endDate; dt.setDate(dt.getDate() + 1)) {
    const dayOfWeek = dt.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    
    // If train has operational days specified, check if it operates on this day
    if (train.operationalDays && train.operationalDays.length > 0) {
      if (train.operationalDays.includes(dayOfWeek)) {
        availableDates.push(dt.toISOString().split('T')[0]);
      }
    } else {
      // If no operational days specified, assume daily service
      availableDates.push(dt.toISOString().split('T')[0]);
    }
  }
  
  return availableDates;
};

// Booking-related interfaces and functions
export interface BookingFormData {
  passengerName: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  travelDate: string;
  seatsRequested?: number;
  preferences?: {
    seatType?: 'WINDOW' | 'AISLE' | 'MIDDLE';
    mealPreference?: 'VEG' | 'NON_VEG' | 'NONE';
  };
}

export interface BookingResponse {
  ticketId: number;
  trainId: number;
  passengerName: string;
  travelDate: string;
  seatNumber: string;
  amount: number;
  status: 'CONFIRMED' | 'WAITING' | 'CANCELLED';
  bookingDate: string;
  seatsBooked?: number;
  trainName?: string;
  source?: string;
  destination?: string;
}

// Update API_URL to match ticket service
const TICKET_API_URL = "http://localhost:6111";

// Submit ticket booking form
const submitTicketForm = async (trainId: number, formData: BookingFormData): Promise<BookingResponse> => {
  const jwtToken = localStorage.getItem("token");
  
  if (!jwtToken) {
    throw new Error("No authentication token found. Please login first.");
  }

  try {
    const response = await fetch(`${TICKET_API_URL}/tickets/book/${trainId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        ...formData,
        seatsRequested: formData.seatsRequested || 1
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.statusText}-${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Ticket booking error:", error);
    throw error;
  }
};

// Check seat availability before booking
export const checkSeatAvailability = async (trainId: number, travelDate: string, seatsRequested: number = 1): Promise<{ available: boolean; availableSeats: number }> => {
  const jwtToken = localStorage.getItem("token");
  
  if (!jwtToken) {
    throw new Error("No authentication token found.");
  }

  try {
    const response = await fetch(`${TRAIN_SERVICE_URL}/trains/${trainId}/availability?date=${travelDate}&seats=${seatsRequested}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error checking availability: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Seat availability check error:", error);
    throw error;
  }
};

// Get user's booked tickets
export const getUserTickets = async (): Promise<BookingResponse[]> => {
  const jwtToken = localStorage.getItem("token");
  
  if (!jwtToken) {
    throw new Error("No authentication token found.");
  }

  try {
    const response = await fetch(`${TICKET_API_URL}/tickets/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching tickets: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    throw error;
  }
};

// Cancel a ticket
export const cancelTicket = async (ticketId: number): Promise<{ success: boolean; message: string; refundAmount?: number }> => {
  const jwtToken = localStorage.getItem("token");
  
  if (!jwtToken) {
    throw new Error("No authentication token found.");
  }

  try {
    const response = await fetch(`${TICKET_API_URL}/tickets/${ticketId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error cancelling ticket: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error cancelling ticket:", error);
    throw error;
  }
};

export default submitTicketForm;