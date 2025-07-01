import React, { useEffect, useState } from "react";
import { Train } from "../../../interfaces/Train";
import { fetchTrains, addTrain, updateTrain, deleteTrain } from "../../../services/api/trainservice";
import TrainForm from "../../../components/ui/trainform/trainfrom";
import RoutesModal from "../../../components/ui/trainform/trainroutes";

const TrainsPage: React.FC = () => {
  const [trains, setTrains] = useState<Train[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTrain, setEditingTrain] = useState<Train | null>(null);

  // For routes modal
  const [routesModalOpen, setRoutesModalOpen] = useState(false);
  const [routesTrain, setRoutesTrain] = useState<Train | null>(null);

  useEffect(() => {
    fetchTrains().then(setTrains);
  }, []);

//  const handleAdd = async (train: Partial<Train>) => {
//   // Remove trainId if present
//   const { trainId, ...trainData } = train;
//   try {
//     await addTrain(trainData);
//     const updatedTrains = await fetchTrains();
//     setTrains(updatedTrains);
//     console.log("Train added successfully:", trainData);
//   } catch (err) {
//     alert("Failed to add train. See console for details.");
//     console.error("Add train error:", err);
//   }
// };


  const handleAdd = async (train: Partial<Train>) => {
    const newTrain = await addTrain(train);
    setTrains([...trains, newTrain]);
  };

  const handleUpdate = async (train: Partial<Train>) => {
    if (!editingTrain) return;
    try {
      await updateTrain(editingTrain.trainId, train);
      const updatedTrains = await fetchTrains();
      setTrains(updatedTrains);
      setEditingTrain(null);
    } catch (err) {
      alert("Failed to update train. See console for details.");
      console.error("Update train error:", err);
    }
  };

  const handleDelete = async (trainId: number) => {
    try {
      await deleteTrain(trainId);
      const updatedTrains = await fetchTrains();
      setTrains(updatedTrains);
    } catch (err) {
      alert("Failed to delete train. See console for details.");
      console.error("Delete train error:", err);
    }
  };

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="my-16 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-blue-900">Train Management</h2>
        <button
          onClick={() => { setEditingTrain(null); setFormOpen(true); }}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add New Train
        </button>
      </div>
      <div className="w-full max-w-7xl mx-auto">
        <div className="hidden md:grid grid-cols-12 gap-24 px-6 py-3 mb-2 rounded-xl bg-blue-50/60 font-semibold text-blue-900 text-xs">
          <div>Train ID</div>
          <div>Name</div>
          <div>Source</div>
          <div>Destination</div>
          <div>Total Seats</div>
          <div>Amount</div>
          <div>Status</div>
          <div>Departure</div>
          <div>Arrival</div>
          <div>Routes</div>
          <div>Actions</div>
        </div>
        <div className="flex flex-col gap-4">
          {trains.map((t, idx) => (
            <div
              key={t.trainId ?? idx}
              className="grid grid-cols-2 md:grid-cols-12 gap-24 items-center px-4 md:px-6 py-4 rounded-xl bg-white/30 backdrop-blur-lg border border-white/40 shadow transition hover:scale-[1.01] text-xs md:text-sm"
            >
              <div className="font-semibold text-blue-900">{t.trainId}</div>
              <div className="text-blue-900">{t.trainName}</div>
              <div className="text-blue-700/90">{t.source}</div>
              <div className="text-blue-700/90">{t.destination}</div>
              <div>{t.totalSeats}</div>
              {/* <div>{t.availableSeats}</div> */}
              <div>₹{t.amount}</div>
              <div>{t.status}</div>
              <div>{t.departureTime}</div>
              <div>{t.arrivalTime}</div>
              <div>
                <button
                  onClick={() => { setRoutesTrain(t); setRoutesModalOpen(true); }}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition text-xs"
                >
                  Routes
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingTrain(t); setFormOpen(true); }}
                  className="p-2 rounded hover:bg-yellow-100 transition"
                  aria-label="Edit"
                >
                  {/* EditIcon */}
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(t.trainId)}
                  className="p-2 rounded hover:bg-red-100 transition"
                  aria-label="Delete"
                >
                  {/* DeleteIcon */}
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {trains.length === 0 && (
            <div className="text-center text-gray-400 py-8">No trains found.</div>
          )}
        </div>
      </div>
      <TrainForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingTrain(null); }}
        onSubmit={editingTrain ? handleUpdate : handleAdd}
        initialData={editingTrain || undefined}
      />
      <RoutesModal
        open={routesModalOpen}
        routes={routesTrain?.routes || []}
        onClose={() => { setRoutesModalOpen(false); setRoutesTrain(null); }}
      />
    </div>
  );
};

export default TrainsPage;