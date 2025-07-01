import { useState } from "react";
import UserForm from "../../components/ui/form";

const TicketManager = () => {
  const [tickets, setTickets] = useState<Array<{
    fullName: string;
    seatCount: string;
    age: string;
    email: string;
    date: string;
  }>>([]);

  const handleFormSubmit = (formData: {
    fullName: string;
    seatCount: string;
    age: string;
    email: string;
    date: string;
  }) => {
    setTickets([...tickets, formData]);
    console.log("Tickets:", [...tickets, formData]);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Ticket Management</h1>
      <UserForm onSubmit={handleFormSubmit} />
      <div className="mt-4">
        <h2 className="text-2xl font-semibold">Tickets</h2>
        <ul>
          {tickets.map((ticket, index) => (
            <li key={index} className="border p-2 mt-2">
              <strong>{ticket.fullName}</strong> ({ticket.seatCount} seats) - {ticket.email}
              ..... {ticket.date} ... {ticket.age} years old
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TicketManager;