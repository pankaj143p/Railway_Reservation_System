export interface Train {
    noOfSeats: number;
    trainId: number;
    trainName: string;
    source: string;
    destination: string;
    totalSeats: number;
    status: string; // e.g., "On Time", "Delayed", "Cancelled"
    departureTime: string; // ISO date string
    arrivalTime: string; // ISO date string
}