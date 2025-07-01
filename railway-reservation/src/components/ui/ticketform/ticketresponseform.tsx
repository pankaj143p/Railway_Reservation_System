import React, { useEffect, useState } from 'react';
import TicketResponse from '../../../interfaces/ticket';

interface TicketFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (ticket: Partial<TicketResponse>) => void;
    initialData?: Partial<TicketResponse>;
}

const TicketResponseForm: React.FC<TicketFormProps> = ({ open, onClose, onSubmit, initialData }) => {
    const [form, setForm] = useState<Partial<TicketResponse>>({
        ticket_id: 0,
        orderId: "",
        fullName: "",
        age: "",
        email: "",
        ticketNumber: "",
        bookingDate: "",
        trainId: 0,
        trainName: "",
        source: "",
        destination: "",
        noOfSeats: 0,
        departureTime: "",
        status: "WAITING",
    });

    useEffect(() => {
        setForm(initialData ? { ...initialData } : {
            ticket_id: 0,
            orderId: "",
            fullName: "",
            age: "",
            email: "",
            ticketNumber: "",
            bookingDate: "",
            trainId: 0,
            trainName: "",
            source: "",
            destination: "",
            noOfSeats: 0,
            departureTime: "",
            status: "WAITING",
        });
    }, [initialData, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...form });
        onClose();
    };

    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/20'>
            <div className='relative w-full max-w-md bg-white/30 backdrop-blur-lg rounded-2xl shadow-lg border border-white/40 p-8'>
                <button
                    onClick={onClose}
                    className='absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl'
                    aria-label="close"
                >
                    &times;
                </button>
                <h3 className="text-xl font-bold mb-4 text-blue-900">Edit Ticket</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        name="fullName"
                        value={form.fullName || ""}
                        onChange={handleChange}
                        placeholder="Full Name"
                        required
                    />
                    <input
                        name="age"
                        value={form.age || ""}
                        onChange={handleChange}
                        placeholder="Age"
                        required
                    />
                    <input
                        name="email"
                        value={form.email || ""}
                        onChange={handleChange}
                        placeholder="Email"
                        type="email"
                        required
                    />
                    <input
                        name="ticketNumber"
                        value={form.ticketNumber || ""}
                        onChange={handleChange}
                        placeholder="Ticket Number"
                        required
                    />
                    <input
                        name="bookingDate"
                        value={form.bookingDate || ""}
                        onChange={handleChange}
                        placeholder="Booking Date"
                        required
                    />
                    <input
                        name="orderId"
                        value={form.orderId || ""}
                        onChange={handleChange}
                        placeholder="Order ID"
                        required
                    />
                    <input
                        name="trainId"
                        value={form.trainId || ""}
                        onChange={handleChange}
                        placeholder="Train ID"
                        required
                    />
                    <input
                        name="trainName"
                        value={form.trainName || ""}
                        onChange={handleChange}
                        placeholder="Train Name"
                        required
                    />
                    <input
                        name="source"
                        value={form.source || ""}
                        onChange={handleChange}
                        placeholder="Source"
                        required
                    />
                    <input
                        name="destination"
                        value={form.destination || ""}
                        onChange={handleChange}
                        placeholder="Destination"
                        required
                    />
                    <input
                        name="noOfSeats"
                        value={form.noOfSeats || ""}
                        onChange={handleChange}
                        placeholder="No. of Seats"
                        required
                    />
                    <input
                        name="departureTime"
                        value={form.departureTime || ""}
                        onChange={handleChange}
                        placeholder="Departure Time"
                        required
                    />
                    <select
                        name="status"
                        value={form.status || "WAITING"}
                        onChange={handleChange}
                        required
                    >
                        <option value="WAITING">WAITING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="CANCELLED">CANCELLED</option>
                    </select>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-blue-700 transition"
                    >
                        Update
                    </button>
                </form>
            </div>
        </div>
    );
};
export default TicketResponseForm;