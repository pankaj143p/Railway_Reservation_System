import React, { useEffect, useState } from 'react';
import TicketsResponse from '../../../../interfaces/ticket';
import { fetchBookedTicket } from '../../../../services/api/ticketservice';

const RevenueCard: React.FC = () => {
  const [tickets, setTickets] = useState<TicketsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        setError(null);
        const ticketData = await fetchBookedTicket();
        setTickets(ticketData);
      } catch (err) {
        console.error('Failed to fetch tickets:', err);
        setError('Failed to load revenue data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center mb-8 border border-white/40">
          <div className="h-6 bg-blue-200/50 rounded-lg w-32 mb-4"></div>
          <div className="h-10 bg-blue-300/50 rounded-lg w-28 mb-2"></div>
          <div className="h-4 bg-blue-100/50 rounded w-40"></div>
        </div>
        <div className="bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center mb-8 border border-white/40">
          <div className="h-6 bg-blue-200/50 rounded-lg w-36 mb-4"></div>
          <div className="h-10 bg-blue-300/50 rounded-lg w-16 mb-2"></div>
          <div className="h-4 bg-blue-100/50 rounded w-32"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-100/40 backdrop-blur-lg rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center mb-8 border border-red-200/40">
        <div className="text-6xl mb-4">⚠️</div>
        <div className="text-xl font-semibold text-red-700 mb-2">Oops! Something went wrong</div>
        <div className="text-sm text-red-600 mb-4 text-center">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  // Calculate revenue data
  const cancelledTickets = tickets
    .filter(ticket => ticket.status === 'CANCELLED')
    .reduce((acc, ticket) => acc + ticket.amount * 0.20, 0);
  
  const confirmedRevenue = tickets
    .filter(ticket => ticket.status === 'CONFIRMED')
    .reduce((acc, ticket) => acc + ticket.amount, 0);
  
  const totalRevenue = confirmedRevenue + cancelledTickets;

  // Calculate ticket statistics
  const confirmedTickets = tickets.filter(ticket => ticket.status === 'CONFIRMED').length;
  const cancelledTicketsCount = tickets.filter(ticket => ticket.status === 'CANCELLED').length;
  // const pendingTickets = tickets.filter(ticket => ticket.status === 'PENDING').length;

  return (
    <>
      {/* Total Revenue Card */}
      <div className="bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center mb-8 border border-white/40 hover:bg-white/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl">
        <div className="text-2xl font-semibold text-blue-700 mb-2 flex items-center gap-2">
          💰 Total Revenue
        </div>
        <div className="text-4xl font-bold text-blue-900 mb-2">
          ₹ {totalRevenue.toLocaleString('en-IN')}
        </div>
        <div className="text-sm text-blue-600/80 text-center">
          <div className="flex gap-4 justify-center">
            <span className="bg-green-100/50 px-2 py-1 rounded-lg">
               Confirmed: ₹{confirmedRevenue.toLocaleString('en-IN')}
            </span>
            {cancelledTickets > 0 && (
              <span className="bg-orange-100/50 px-2 py-1 rounded-lg">
                💸 Cancellation Fee: ₹{cancelledTickets.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Total Tickets Sold Card */}
      <div className="bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center mb-8 border border-white/40 hover:bg-white/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl">
        <div className="text-2xl font-semibold text-blue-700 mb-2 flex items-center gap-2">
          🎫 Total Tickets Sold
        </div>
        <div className="text-4xl font-bold text-blue-900 mb-2">
          {tickets.length}
        </div>
        <div className="text-sm text-blue-600/80 text-center">
          <div className="flex gap-2 justify-center flex-wrap">
            <span className="bg-green-100/50 px-2 py-1 rounded-lg text-xs">
               Confirmed: {confirmedTickets}
            </span>
            {cancelledTicketsCount > 0 && (
              <span className="bg-red-100/50 px-2 py-1 rounded-lg text-xs">
                ❌ Cancelled: {cancelledTicketsCount}
              </span>
            )}
            {/* {pendingTickets > 0 && (
              <span className="bg-yellow-100/50 px-2 py-1 rounded-lg text-xs">
                ⏳ Pending: {pendingTickets} */}
              {/* </span> */}
            {/* )} */}
          </div>
        </div>
      </div>

      {/* Additional Stats Card */}
      {tickets.length > 0 && (
        <div className="bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg p-6 mb-8 border border-white/40 hover:bg-white/50 transition-all duration-300">
          <div className="text-lg font-semibold text-blue-700 mb-4 text-center">
            📊 Quick Stats
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-50/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-800">
                ₹{tickets.length > 0 ? (totalRevenue / tickets.length).toFixed(0) : '0'}
              </div>
              <div className="text-xs text-blue-600">Avg. Revenue per Ticket</div>
            </div>
            <div className="bg-green-50/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-800">
                {tickets.length > 0 ? ((confirmedTickets / tickets.length) * 100).toFixed(1) : '0'}%
              </div>
              <div className="text-xs text-green-600">Success Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && tickets.length === 0 && (
        <div className="bg-gray-100/40 backdrop-blur-lg rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center mb-8 border border-gray-200/40">
          <div className="text-6xl mb-4">📭</div>
          <div className="text-xl font-semibold text-gray-600 mb-2">No Tickets Found</div>
          <div className="text-sm text-gray-500 text-center">
            No ticket data available yet. Revenue information will appear here once tickets are booked.
          </div>
        </div>
      )}
    </>
  );
};

export default RevenueCard;