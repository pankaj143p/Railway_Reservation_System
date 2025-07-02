import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import axios from 'axios';
import type TicketResponse from '../../interfaces/ticket';
import type { TicketStatus } from '../../interfaces/ticket';
import CancellationModal from '../../components/ui/CancellationModal';
import { cancelTicketWithRefund, CancellationResponse } from '../../services/api/cancellationService';

const BookedTickets = () => {
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellationModal, setCancellationModal] = useState({
    isOpen: false,
    ticketId: null as number | null,
    ticketDetails: null as TicketResponse | null,
    isLoading: false,
    cancellationResult: null as CancellationResponse | null
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    let userEmail: string | undefined = undefined;
    try {
      const decoded: any = jwtDecode(token);
      userEmail = decoded.userId || decoded.id || decoded.sub;
    } catch {
      setLoading(false);
      return;
    }
    if (!userEmail) {
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:6111/tickets/user/${userEmail}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setTickets(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCancel = (ticket: TicketResponse) => {
    setCancellationModal({
      isOpen: true,
      ticketId: ticket.ticket_id,
      ticketDetails: ticket,
      isLoading: false,
      cancellationResult: null
    });
  };

  const handleConfirmCancellation = async () => {
    if (!cancellationModal.ticketId) return;
    
    setCancellationModal(prev => ({ ...prev, isLoading: true }));
    
    try {
      const result = await cancelTicketWithRefund(cancellationModal.ticketId);
      
      // Update the ticket status to CANCELLED in the local state
      setTickets(tickets.map(ticket =>
        ticket.ticket_id === cancellationModal.ticketId
          ? { ...ticket, status: "CANCELLED" as TicketStatus }
          : ticket
      ));
      
      setCancellationModal(prev => ({ 
        ...prev, 
        isLoading: false,
        cancellationResult: result
      }));
      
    } catch (error) {
      console.error('Cancellation failed:', error);
      setCancellationModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleModalClose = () => {
    setCancellationModal({
      isOpen: false,
      ticketId: null,
      ticketDetails: null,
      isLoading: false,
      cancellationResult: null
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-40 text-lg font-semibold text-blue-700">
      Loading...
    </div>
  );

  return (
    <div className="my-12 px-12 max-w-7xl mx-auto py-8 min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-900 drop-shadow-lg">Booked Tickets</h1>
      {tickets.length === 0 ? (
        <p className="text-center text-gray-500">No tickets booked.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tickets.map(ticket => (
            <div
              key={ticket.ticket_id}
              className="relative rounded-2xl p-6 shadow-xl bg-white/30 backdrop-blur-md border border-white/40 hover:scale-105 transition-transform duration-300
                before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/60 before:to-blue-200/30 before:-z-10"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-blue-800">{ticket.trainName || "Train"}</h2>
                {ticket.status && (
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-bold shadow
                    ${ticket.status === "CONFIRMED" ? "bg-green-200 text-green-800" : ""}
                    ${ticket.status === "WAITING" ? "bg-yellow-200 text-yellow-800" : ""}
                    ${ticket.status === "CANCELLED" ? "bg-red-200 text-red-800" : ""}
                  `}>
                    {ticket.status}
                  </span>
                )}
              </div>
              <div className="mb-2"><span className="font-medium text-gray-700">Ticket No:</span> {ticket.ticketNumber}</div>
              <div className="mb-2"><span className="font-medium text-gray-700">Name:</span> {ticket.fullName}</div>
              {ticket.age && <div className="mb-2"><span className="font-medium text-gray-700">Age:</span> {ticket.age}</div>}
              {ticket.email && <div className="mb-2"><span className="font-medium text-gray-700">Email:</span> {ticket.email}</div>}
              {ticket.bookingDate && <div className="mb-2"><span className="font-medium text-gray-700">Booking Date:</span> {ticket.bookingDate}</div>}
              {ticket.source && <div className="mb-2"><span className="font-medium text-gray-700">From:</span> {ticket.source}</div>}
              {ticket.destination && <div className="mb-2"><span className="font-medium text-gray-700">To:</span> {ticket.destination}</div>}
              {ticket.noOfSeats !== undefined && <div className="mb-2"><span className="font-medium text-gray-700">Seats:</span> {ticket.noOfSeats}</div>}
              {ticket.departureTime && <div className="mb-2"><span className="font-medium text-gray-700">Departure:</span> {ticket.departureTime}</div>}
              {ticket.orderId && <div className="mb-2"><span className="font-medium text-gray-700">Order ID:</span> {ticket.orderId}</div>}
              {ticket.userEmail && <div className="mb-2"><span className="font-medium text-gray-700">User Email:</span> {ticket.userEmail}</div>}
              {ticket.trainId && <div className="mb-2"><span className="font-medium text-gray-700">Train ID:</span> {ticket.trainId}</div>}
              <div className="mt-4">
                {ticket.status !== "CANCELLED" && (
                  <button
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-xl shadow transition"
                    onClick={() => handleCancel(ticket)}
                  >
                    Cancel & Refund
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Cancellation Modal */}
      <CancellationModal
        isOpen={cancellationModal.isOpen}
        onClose={handleModalClose}
        onConfirm={handleConfirmCancellation}
        ticketNumber={cancellationModal.ticketDetails?.ticketNumber}
        trainName={cancellationModal.ticketDetails?.trainName}
        amount={cancellationModal.ticketDetails?.amount}
        isLoading={cancellationModal.isLoading}
        cancellationResult={cancellationModal.cancellationResult}
      />
    </div>
  );
};

export default BookedTickets;