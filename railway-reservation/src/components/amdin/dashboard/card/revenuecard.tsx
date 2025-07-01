import React, { useEffect, useState } from 'react';
import TicketsResponse from '../../../../interfaces/ticket';
import { fetchBookedTicket } from '../../../../services/api/ticketservice';


const RevenueCard: React.FC = () => {
  const [tickets, setTickets] = useState<TicketsResponse[]>([]);
    useEffect(() => {
      fetchBookedTicket().then(setTickets);
    }, []);

    const totalRevenue = tickets.reduce((acc, ticket) => acc + ticket.amount, 0);
    return (
    <>
  <div className="bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center mb-8 border border-white/40">
    <div className="text-2xl font-semibold text-blue-700 mb-2">Total Revenue</div>
    <div className="text-4xl font-bold text-blue-900 mb-1">₹ {totalRevenue.toLocaleString()}</div>
    {/* <div className="text-sm text-blue-700/70"></div> */}
    
  </div>
   <div className="bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center mb-8 border border-white/40">
    <div className="text-2xl font-semibold text-blue-700 mb-2">Total Tickets Sell</div>
    <div className="text-4xl font-bold text-blue-900 mb-1">{tickets.length}</div>
    {/* <div className="text-sm text-blue-700/70"></div> */}
    
  </div>
  </>

);

};

export default RevenueCard;