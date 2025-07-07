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
    inactiveDates: [],
    operationalStatus: "OPERATIONAL",
    maintenanceNotes: "",
    isActive: true,
  });

  // Dynamic routes state
  const [routes, setRoutes] = useState<string[]>([""]);
  const [inactiveDates, setInactiveDates] = useState<string[]>([""]);

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData });
      setRoutes(initialData?.routes && initialData.routes.length > 0 ? [...initialData.routes] : [""]);
      setInactiveDates(initialData?.inactiveDates && initialData.inactiveDates.length > 0 ? [...initialData.inactiveDates] : [""]);
    } else {
      setForm({
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
        inactiveDates: [],
        operationalStatus: "OPERATIONAL",
        maintenanceNotes: "",
        isActive: true,
      });
      setRoutes([""]);
      setInactiveDates([""]);
    }
  }, [initialData, open]);

  // Handle input changes and ensure numbers are numbers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | any) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setForm({ ...form, [name]: value === "" ? 0 : Number(value) });
    } else if (type === "boolean") {
      setForm({ ...form, [name]: value });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Dynamic routes handlers
  const handleRouteChange = (idx: number, value: string) => {
    const newRoutes = [...routes];
    newRoutes[idx] = value;
    setRoutes(newRoutes);
    setForm({ ...form, routes: newRoutes.filter(r => r.trim() !== "") });
  };

  const handleInactiveDateChange = (idx: number, value: string) => {
    const newDates = [...inactiveDates];
    newDates[idx] = value;
    setInactiveDates(newDates);
    setForm({ ...form, inactiveDates: newDates.filter(d => d.trim() !== "") });
  };

  const addRoute = () => {
    const newRoutes = [...routes, ""];
    setRoutes(newRoutes);
    setForm({ ...form, routes: routes.filter(r => r.trim() !== "") });
  };
  
  const addInactiveDate = () => {
    const newDates = [...inactiveDates, ""];
    setInactiveDates(newDates);
    setForm({ ...form, inactiveDates: inactiveDates.filter(d => d.trim() !== "") });
  };

  const removeRoute = (idx: number) => {
    const newRoutes = routes.filter((_, i) => i !== idx);
    setRoutes(newRoutes.length ? newRoutes : [""]);
    setForm({ ...form, routes: newRoutes.filter(r => r.trim() !== "") });
  };

  const removeInactiveDate = (idx: number) => {
    const newDates = inactiveDates.filter((_, i) => i !== idx);
    setInactiveDates(newDates.length ? newDates : [""]);
    setForm({ ...form, inactiveDates: newDates.filter(d => d.trim() !== "") });
  };

  // Ensure time is in HH:mm:ss format
  const formatTime = (t: string) =>
    t && t.length === 5 ? `${t}:00` : t;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Remove empty routes and inactive dates before submit
    const cleanedRoutes = routes.filter(r => r.trim() !== "");
    const cleanedInactiveDates = inactiveDates.filter(d => d.trim() !== "");
    
    const submitData = {
      ...form,
      totalSeats: Number(form.totalSeats) || 0,
      amount: Number(form.amount) || 0,
      departureTime: formatTime(form.departureTime || ""),
      arrivalTime: formatTime(form.arrivalTime || ""),
      date: form.date,
      routes: cleanedRoutes,
      operationalStatus: form.operationalStatus || "OPERATIONAL",
      maintenanceNotes: form.maintenanceNotes || "",
      inactiveDates: cleanedInactiveDates,
      isActive: form.isActive !== undefined ? form.isActive : true,
    };

    console.log("Submitting train data:", submitData);
    onSubmit(submitData);
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
          <input 
            name="trainName" 
            value={form.trainName || ""} 
            onChange={handleChange} 
            placeholder="Train Name" 
            className="border rounded px-3 py-2 bg-white/60" 
            required 
          />
          <input 
            name="source" 
            value={form.source || ""} 
            onChange={handleChange} 
            placeholder="Source" 
            className="border rounded px-3 py-2 bg-white/60" 
            required 
          />
          <input 
            name="destination" 
            value={form.destination || ""} 
            onChange={handleChange} 
            placeholder="Destination" 
            className="border rounded px-3 py-2 bg-white/60" 
            required 
          />
          <input 
            name="totalSeats" 
            type="number" 
            value={form.totalSeats || ""} 
            onChange={handleChange} 
            placeholder="Total Seats" 
            className="border rounded px-3 py-2 bg-white/60" 
            required 
          />
          <input 
            name="amount" 
            type="number" 
            value={form.amount || ""} 
            onChange={handleChange} 
            placeholder="Amount" 
            className="border rounded px-3 py-2 bg-white/60" 
            required 
          />
          <input 
            name="status" 
            value={form.status || ""} 
            onChange={handleChange} 
            placeholder="Status" 
            className="border rounded px-3 py-2 bg-white/60" 
            required 
          />
          <input 
            name="departureTime" 
            type="time" 
            value={form.departureTime || ""} 
            onChange={handleChange} 
            placeholder="Departure Time" 
            className="border rounded px-3 py-2 bg-white/60" 
            required 
          />
          <input 
            name="arrivalTime" 
            type="time" 
            value={form.arrivalTime || ""} 
            onChange={handleChange} 
            placeholder="Arrival Time" 
            className="border rounded px-3 py-2 bg-white/60" 
            required 
          />
          <input 
            name="date" 
            type="date" 
            value={form.date || ""} 
            onChange={handleChange} 
            placeholder="Journey Date" 
            className="border rounded px-3 py-2 bg-white/60" 
            required 
          />

          {/* Operational Status Field */}
          <div>
            <label className="block mb-1 font-medium text-blue-900">Operational Status</label>
            <select
              name="operationalStatus"
              value={form.operationalStatus || "OPERATIONAL"}
              onChange={handleChange}
              className="border rounded px-3 py-2 bg-white/60 w-full"
              required
            >
              <option value="OPERATIONAL">Operational</option>
              <option value="MAINTENANCE">Under Maintenance</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="DELAYED">Delayed</option>
            </select>
          </div>

          {/* Maintenance Notes Field */}
          <div>
            <label className="block mb-1 font-medium text-blue-900">Maintenance Notes</label>
            <textarea
              name="maintenanceNotes"
              value={form.maintenanceNotes || ""}
              onChange={handleChange}
              placeholder="Enter maintenance notes, delays, or other operational details..."
              className="border rounded px-3 py-2 bg-white/60 w-full min-h-[80px] resize-y"
              rows={3}
            />
          </div>

          {/* IsActive Field */}
          <div>
            <label className="block mb-1 font-medium text-blue-900">Train Status</label>
            <select
              name="isActive"
              value={form.isActive !== undefined ? (form.isActive ? "true" : "false") : "true"}
              onChange={(e) => handleChange({
                target: {
                  name: "isActive",
                  value: e.target.value === "true",
                  type: "boolean"
                }
              } as any)}
              className="border rounded px-3 py-2 bg-white/60 w-full"
              required
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <small className="text-gray-600 text-xs mt-1 block">
              Inactive trains will not be visible to customers for booking
            </small>
          </div>

          <div>
            <label className="block mb-1 font-medium text-blue-900">Routes</label>
            {routes.map((route, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  value={route}
                  onChange={e => handleRouteChange(idx, e.target.value)}
                  className="border rounded px-3 py-2 flex-1 bg-white/60"
                  placeholder={`Route ${idx + 1}`}
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

          <div>
            <label className="block mb-1 font-medium text-blue-900">Inactive Dates</label>
            {inactiveDates.map((date, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="date"
                  value={date}
                  onChange={e => handleInactiveDateChange(idx, e.target.value)}
                  className="border rounded px-3 py-2 flex-1 bg-white/60"
                  placeholder={`Inactive Date ${idx + 1}`}
                />
                {inactiveDates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInactiveDate(idx)}
                    className="text-red-500 px-2"
                    title="Remove inactive date"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addInactiveDate}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition text-xs"
            >
              + Add Inactive Date
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