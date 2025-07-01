import React, { useState, useEffect } from "react";
import { Train } from "../../../interfaces/Train";

interface TrainFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (train: Partial<Train>) => void;
  initialData?: Partial<Train>;
}

const TrainForm: React.FC<TrainFormProps> = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState<Partial<Train>>({
    trainName: "",
    source: "",
    destination: "",
    totalSeats: 0,
    amount: 0,
    status: "",
    departureTime: "",
    arrivalTime: "",
    date: "",
    routes: [],
  });

  // Dynamic routes state
  const [routes, setRoutes] = useState<string[]>([""]);

  useEffect(() => {
    setForm(
      initialData
        ? { ...initialData }
        : {
            trainName: "",
            source: "",
            destination: "",
            totalSeats: 0,
            amount: 0,
            status: "",
            departureTime: "",
            arrivalTime: "",
            date: "",
            routes: [],
          }
    );
    setRoutes(initialData?.routes && initialData.routes.length > 0 ? [...initialData.routes] : [""]);
  }, [initialData, open]);

  // Handle input changes and ensure numbers are numbers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setForm({ ...form, [name]: value === "" ? "" : Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Dynamic routes handlers
  const handleRouteChange = (idx: number, value: string) => {
    const newRoutes = [...routes];
    newRoutes[idx] = value;
    setRoutes(newRoutes);
    setForm({ ...form, routes: newRoutes });
  };

  const addRoute = () => {
    setRoutes([...routes, ""]);
    setForm({ ...form, routes: [...routes, ""] });
  };

  const removeRoute = (idx: number) => {
    const newRoutes = routes.filter((_, i) => i !== idx);
    setRoutes(newRoutes.length ? newRoutes : [""]);
    setForm({ ...form, routes: newRoutes.length ? newRoutes : [""] });
  };

  // Ensure time is in HH:mm:ss format
  const formatTime = (t: string) =>
    t && t.length === 5 ? `${t}:00` : t;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Remove empty routes before submit
    const cleanedRoutes = routes.filter(r => r.trim() !== "");
    onSubmit({
      ...form,
      totalSeats: Number(form.totalSeats),
      amount: Number(form.amount),
      departureTime: formatTime(form.departureTime || ""),
      arrivalTime: formatTime(form.arrivalTime || ""),
      date: form.date, // input type="date" gives "YYYY-MM-DD"
      routes: cleanedRoutes,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-lg bg-white/30 backdrop-blur-lg rounded-2xl shadow-lg border border-white/40 p-8 overflow-y-auto max-h-[90vh] custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-blue-900">{initialData ? "Edit Train" : "Add New Train"}</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="trainName" value={form.trainName || ""} onChange={handleChange} placeholder="Train Name" className="border rounded px-3 py-2 bg-white/60" required />
          <input name="source" value={form.source || ""} onChange={handleChange} placeholder="Source" className="border rounded px-3 py-2 bg-white/60" required />
          <input name="destination" value={form.destination || ""} onChange={handleChange} placeholder="Destination" className="border rounded px-3 py-2 bg-white/60" required />
          <input name="totalSeats" type="number" value={form.totalSeats || ""} onChange={handleChange} placeholder="Total Seats" className="border rounded px-3 py-2 bg-white/60" required />
          <input name="amount" type="number" value={form.amount || ""} onChange={handleChange} placeholder="Amount" className="border rounded px-3 py-2 bg-white/60" required />
          <input name="status" value={form.status || ""} onChange={handleChange} placeholder="Status" className="border rounded px-3 py-2 bg-white/60" required />
          <input name="departureTime" type="time" value={form.departureTime || ""} onChange={handleChange} placeholder="Departure Time" className="border rounded px-3 py-2 bg-white/60" required />
          <input name="arrivalTime" type="time" value={form.arrivalTime || ""} onChange={handleChange} placeholder="Arrival Time" className="border rounded px-3 py-2 bg-white/60" required />
          <input name="date" type="date" value={form.date || ""} onChange={handleChange} placeholder="Journey Date" className="border rounded px-3 py-2 bg-white/60" required />

          <div>
            <label className="block mb-1 font-medium text-blue-900">Routes</label>
            {routes.map((route, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  value={route}
                  onChange={e => handleRouteChange(idx, e.target.value)}
                  className="border rounded px-3 py-2 flex-1 bg-white/60"
                  placeholder={`Route ${idx + 1}`}
                  required
                />
                {routes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRoute(idx)}
                    className="text-red-500 px-2"
                    title="Remove route"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addRoute}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition text-xs"
            >
              + Add Route
            </button>
          </div>

          <button type="submit" className="bg-blue-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-blue-700 transition">
            {initialData ? "Update" : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrainForm;