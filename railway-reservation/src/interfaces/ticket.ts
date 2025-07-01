import { Ticket } from "lucide-react";

export default interface Ticket {
    fullName: string;
    seatCount: string;
    age: string;
    email: string;
    date: string;
}


export default interface TicketResponse{
  ticket_id: number;
  orderId: string;
  amount: number;
  fullName: string;
  age: string;
  email: string;
  ticketNumber: string;
  bookingDate: string;
  userEmail: string;
  trainId: number;
  trainName: string;
  source: string;
  destination: string;
  noOfSeats: number;
  departureTime: string; 
  status: TicketStatus;
}

export type TicketStatus = "WAITING" | "CONFIRMED" | "CANCELLED";
