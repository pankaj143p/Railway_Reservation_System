import React, { useEffect, useState } from 'react';
import TicketsResponse from '../../../interfaces/ticket';
import { fetchBookedTicket } from '../../../services/api/ticketservice';

// const EditIcon = () => (
//   <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" />
//   </svg>
// );

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const DetailModal: React.FC<DetailModalProps> = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/40">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          aria-label="close"
        >
          &times;
        </button>
        <h3 className="text-lg font-bold mb-4 text-blue-900">{title}</h3>
        <div>{children}</div>
      </div>
    </div>
  );
};

// Helper function to format date as DD-MM-YYYY
function formatDate(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

const TicketPage: React.FC = () => {
  const [tickets, setTickets] = useState<TicketsResponse[]>([]);
  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    type: 'passenger' | 'train' | null;
    ticket: TicketsResponse | null;
  }>({ open: false, type: null, ticket: null });

  useEffect(() => {
    fetchBookedTicket().then(setTickets);
  }, []);

  const openPassengerDetails = (ticket: TicketsResponse) => {
    setDetailModal({ open: true, type: 'passenger', ticket });
  };

  const openTrainDetails = (ticket: TicketsResponse) => {
    setDetailModal({ open: true, type: 'train', ticket });
  };

  const closeModal = () => {
    setDetailModal({ open: false, type: null, ticket: null });
  };

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 py-8 px-2 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold text-cyan-700 drop-shadow-lg">Ticket Management</h2>
        </div>
        <div className="overflow-x-auto">
          <div className="hidden md:grid grid-cols-6 gap-6 px-8 py-4 mb-3 rounded-2xl bg-white/60 backdrop-blur-lg font-semibold text-blue-900 shadow-lg">
            <div>Ticket ID</div>
            <div>Train Name</div>
            <div>Ticket Number</div>
            <div>Booking Date</div>
            <div>Status</div>
            <div className="text-center">Actions</div>
          </div>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.ticket_id}
                className="grid grid-cols-1 md:grid-cols-6 gap-4 px-4 md:px-8 py-4 rounded-2xl bg-white/60 backdrop-blur-lg items-center shadow-lg border border-white/40"
              >
                <div className="font-medium">{ticket.ticket_id}</div>
                <div>{ticket.trainName}</div>
                <div>{ticket.ticketNumber}</div>
                <div>{formatDate(ticket.bookingDate)}</div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                    ${ticket.status === "CONFIRMED" ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {ticket.status}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row gap-2 justify-center">
                  <button
                    onClick={() => openPassengerDetails(ticket)}
                    className="bg-blue-500/80 hover:bg-blue-600/90 text-white px-3 py-1 rounded-lg shadow transition"
                  >
                    Passenger Details
                  </button>
                  <button
                    onClick={() => openTrainDetails(ticket)}
                    className="bg-green-500/80 hover:bg-green-600/90 text-white px-3 py-1 rounded-lg shadow transition"
                  >
                    Train Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Modal for details */}
      <DetailModal
        open={detailModal.open}
        onClose={closeModal}
        title={
          detailModal.type === 'passenger'
            ? 'Passenger Details'
            : detailModal.type === 'train'
            ? 'Train Details'
            : ''
        }
      >
        {detailModal.type === 'passenger' && detailModal.ticket && (
          <div className="space-y-3">
            <div>
              <span className="font-semibold">Name:</span> {detailModal.ticket.fullName}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {detailModal.ticket.email}
            </div>
            <div>
              <span className="font-semibold">Age:</span> {detailModal.ticket.age}
            </div>
            <div>
              <span className="font-semibold">Booking Date:</span> {formatDate(detailModal.ticket.bookingDate)}
            </div>
          </div>
        )}
        {detailModal.type === 'train' && detailModal.ticket && (
          <div className="space-y-3">
            <div>
              <span className="font-semibold">Train Name:</span> {detailModal.ticket.trainName}
            </div>
            <div>
              <span className="font-semibold">Train ID:</span> {detailModal.ticket.trainId}
            </div>
            <div>
              <span className="font-semibold">Source:</span> {detailModal.ticket.source}
            </div>
            <div>
              <span className="font-semibold">Destination:</span> {detailModal.ticket.destination}
            </div>
            <div>
              <span className="font-semibold">Departure Date:</span> {formatDate(detailModal.ticket.departureTime)}
            </div>
            <div>
              {/* <span className="font-semibold">Arrival Date:</span> {formatDate(detailModal.ticket.a)} */}
            </div>
          </div>
        )}
      </DetailModal>
    </div>
  );
};

export default TicketPage;