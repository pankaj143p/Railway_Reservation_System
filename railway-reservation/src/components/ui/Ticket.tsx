import { useEffect, useState } from "react";

const dummyTicket = {
  pnr: "PNR1234567",
  passengerName: "Rahul Sharma",
  trainNumber: "12345",
  trainName: "Rajdhani Express",
  from: "Delhi",
  to: "Mumbai",
  date: "2025-06-12",
  seatNumber: "B2-45",
  coach: "B2",
  bookingStatus: "CONFIRMED"
};

const Ticket = ({ pnr }: { pnr: string }) => {
  const [ticket, setTicket] = useState<any>(null);

  useEffect(() => {
    setTicket(dummyTicket);
  }, [pnr]);

  if (!ticket) return <div>Loading ticket...</div>;

  return (
    <div className="relative max-w-md mx-auto mt-10 rounded-2xl shadow-lg border-4 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
      {/* Decorative left stripe */}
      <div className="absolute left-0 top-0 h-full w-3 bg-gradient-to-b from-blue-500 via-yellow-400 to-blue-500" />
      <div className="pl-6 pr-8 py-8">
        <h2 className="text-center text-2xl font-bold text-blue-600 tracking-widest mb-2 flex items-center justify-center gap-2">
          <span className="text-yellow-400">🚆</span> Railway Ticket
        </h2>
        <hr className="border-dashed border-blue-900 my-3" />
        <div className="flex justify-between mb-2 text-gray-700">
          <span>PNR:</span>
          <span className="font-semibold text-blue-400">{ticket.pnr}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Name:</span>
          <span className="font-semibold">{ticket.passengerName}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Train:</span>
          <span>
            <b>{ticket.trainNumber}</b> - {ticket.trainName}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">From:</span>
          <span className="font-semibold text-green-600">{ticket.from}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">To:</span>
          <span className="font-semibold text-red-500">{ticket.to}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Date:</span>
          <span>{ticket.date}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Coach/Seat:</span>
          <span>
            <b>{ticket.coach}</b> / <b>{ticket.seatNumber}</b>
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Status:</span>
          <span
            className={`font-bold ${
              ticket.bookingStatus === "CONFIRMED"
                ? "text-green-900"
                : "text-red-900"
            }`}
          >
            {ticket.bookingStatus}
          </span>
        </div>
        <hr className="border-dashed border-blue-400 my-3" />
        <div className="text-xs text-center text-gray-500">
          Thank you for booking with us!
        </div>
      </div>
    </div>
  );
};

export default Ticket;