export interface Train {
  trainId: number;
  trainName: string;
  source: string;
  destination: string;
  totalSeats: number;
  amount: number;
  status: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  routes: string[];
  // New fields for multi-date booking
  operationalDays?: string[]; // Days of week this train operates (e.g., ['MON', 'TUE', 'WED'])
  availableSeats?: { [date: string]: number }; // Date-wise available seats
  validUntil?: string; // Last date for booking (default: 3 months from creation)
}

export interface TrainSchedule {
  trainId: number;
  trainName?: string; // Added optional trainName
  date: string;
  availableSeats: number;
  totalSeats: number;
  departureTime: string;
  arrivalTime: string;
  amount: number;
  status: 'AVAILABLE' | 'FULL' | 'CANCELLED';
  source?: string; // Added optional source
  destination?: string; // Added optional destination
  routes?: string[]; // Added optional routes
}

export interface TrainSearchParams {
  source: string;
  destination: string;
  fromDate: string;
  toDate?: string; // Optional: for range search
  passengers?: number;
}
