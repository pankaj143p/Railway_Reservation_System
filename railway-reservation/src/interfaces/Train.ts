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
  inactiveDates: string[];
  operationalDays: string[];
  availableSeats?: { [date: string]: number }; // Date-wise available seats
  validUntil?: string; // Last date for booking (default: 3 months from creation)
  // New admin fields
  operationalStatus?: 'OPERATIONAL' | 'MAINTENANCE' | 'CANCELLED' | 'DELAYED'; // Current operational status
  maintenanceNotes?: string; // Notes for maintenance or operational issues
  isActive?: boolean; // For soft delete functionality (default: true)
  
  // Seat class configuration
  sleeperSeats?: number; // Number of sleeper seats
  ac2Seats?: number; // Number of AC 2-tier seats
  ac1Seats?: number; // Number of AC 1-tier seats
  sleeperPrice?: number; // Price for sleeper class (₹300 base)
  ac2Price?: number; // Price for AC 2-tier class (₹700 base)
  ac1Price?: number; // Price for AC 1-tier class (₹1300 base)
}

export interface SeatAvailability {
  seatClass: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
  seatRangeStart: number;
  seatRangeEnd: number;
}

export interface TrainSearchResult {
  trainId: number;
  trainName: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  seatAvailability: SeatAvailability[];
  searchDate: string;
  operationalStatus: string;
}

export interface SeatClassConfig {
  sleeperSeats: number;
  ac2Seats: number;
  ac1Seats: number;
  sleeperPrice: number;
  ac2Price: number;
  ac1Price: number;
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
  
  // Seat class availability
  availableSleeperSeats?: number;
  availableAc2Seats?: number;
  availableAc1Seats?: number;
}

export interface TrainSearchParams {
  source: string;
  destination: string;
  fromDate: string;
  toDate?: string; // Optional: for range search
  passengers?: number;
}
