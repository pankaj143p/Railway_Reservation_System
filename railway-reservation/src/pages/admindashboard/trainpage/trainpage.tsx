import React, { useEffect, useState } from "react";
import { Train } from "../../../interfaces/Train";
import { fetchTrains, addTrain, updateTrain } from "../../../services/api/trainservice";
import TrainForm from "../../../components/ui/trainform/trainfrom";
import RoutesModal from "../../../components/ui/trainform/trainroutes";

const TrainsPage: React.FC = () => {
  const [trains, setTrains] = useState<Train[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTrain, setEditingTrain] = useState<Train | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [trainToDelete, setTrainToDelete] = useState<Train | null>(null);

  // For routes modal
  const [routesModalOpen, setRoutesModalOpen] = useState(false);
  const [routesTrain, setRoutesTrain] = useState<Train | null>(null);

  useEffect(() => {
    console.log("Fetching trains...");
    fetchTrains()
      .then(data => {
        console.log("Trains fetched:", data, "Type:", typeof data, "Is Array:", Array.isArray(data));
        // Ensure we always have an array
        if (Array.isArray(data)) {
          setTrains(data);
        } else {
          console.error("fetchTrains did not return an array:", data);
          setTrains([]);
        }
      })
      .catch(error => {
        console.error("Error fetching trains:", error);
        setTrains([]);
      });
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
    try {
      const newTrain = await addTrain(train);
      if (Array.isArray(trains)) {
        setTrains([...trains, newTrain]);
      } else {
        setTrains([newTrain]);
      }
    } catch (err) {
      alert("Failed to add train. See console for details.");
      console.error("Add train error:", err);
    }
  };

  const handleUpdate = async (train: Partial<Train>) => {
    if (!editingTrain) return;
    try {
      await updateTrain(editingTrain.trainId, train);
      const updatedTrains = await fetchTrains();
      if (Array.isArray(updatedTrains)) {
        setTrains(updatedTrains);
      } else {
        console.error("fetchTrains did not return an array:", updatedTrains);
        setTrains([]);
      }
      setEditingTrain(null);
    } catch (err) {
      alert("Failed to update train. See console for details.");
      console.error("Update train error:", err);
    }
  };

  const handleDelete = async (trainId: number) => {
    if (Array.isArray(trains)) {
      const train = trains.find(t => t.trainId === trainId);
      if (train) {
        setTrainToDelete(train);
        setDeleteConfirmOpen(true);
      }
    }
  };

  const confirmDelete = async () => {
    if (!trainToDelete) return;
    
    try {
      // Soft delete: update the train with isActive = false instead of deleting
      await updateTrain(trainToDelete.trainId, { isActive: false });
      const updatedTrains = await fetchTrains();
      setTrains(updatedTrains);
      setDeleteConfirmOpen(false);
      setTrainToDelete(null);
    } catch (err) {
      alert("Failed to deactivate train. See console for details.");
      console.error("Soft delete train error:", err);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setTrainToDelete(null);
  };

  const handleReactivate = async (trainId: number) => {
    try {
      await updateTrain(trainId, { isActive: true });
      const updatedTrains = await fetchTrains();
      setTrains(updatedTrains);
    } catch (err) {
      alert("Failed to reactivate train. See console for details.");
      console.error("Reactivate train error:", err);
    }
  };

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="my-16 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-blue-900">Train Management</h2>
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2 text-blue-900 text-sm">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="rounded"
            />
            Show Inactive Trains
          </label>
          <button
            onClick={() => { setEditingTrain(null); setFormOpen(true); }}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Add New Train
          </button>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto">
        <div className="hidden md:grid grid-cols-14 gap-4 px-6 py-3 mb-2 rounded-xl bg-blue-50/60 font-semibold text-blue-900 text-xs">
          <div>Train ID</div>
          <div>Name</div>
          <div>Source</div>
          <div>Destination</div>
          <div>Total Seats</div>
          <div>Amount</div>
          <div>Status</div>
          <div>Departure</div>
          <div>Arrival</div>
          <div>Operational</div>
          <div>Notes</div>
          <div>Active</div>
          <div>Routes</div>
          <div>Actions</div>
        </div>
        <div className="flex flex-col gap-4">
          {(() => {
            console.log("Current trains state:", trains, "Type:", typeof trains, "Is Array:", Array.isArray(trains));
            const trainsArray = Array.isArray(trains) ? trains : [];
            return trainsArray
              .filter(train => showInactive || train.isActive !== false)
              .map((t, idx) => (
            <div
              key={t.trainId ?? idx}
              className={`grid grid-cols-2 md:grid-cols-14 gap-4 items-center px-4 md:px-6 py-4 rounded-xl backdrop-blur-lg border border-white/40 shadow transition hover:scale-[1.01] text-xs md:text-sm ${
                t.isActive === false ? 'bg-gray-200/30 opacity-60' : 'bg-white/30'
              }`}
            >
              <div className="font-semibold text-blue-900">{t.trainId}</div>
              <div className="text-blue-900">{t.trainName}</div>
              <div className="text-blue-700/90">{t.source}</div>
              <div className="text-blue-700/90">{t.destination}</div>
              <div>{t.totalSeats}</div>
              <div>₹{t.amount}</div>
              <div>{t.status}</div>
              <div>{t.departureTime}</div>
              <div>{t.arrivalTime}</div>
              <div>
                <span className={`px-2 py-1 rounded text-xs ${
                  t.operationalStatus === 'OPERATIONAL' ? 'bg-green-100 text-green-700' :
                  t.operationalStatus === 'MAINTENANCE' ? 'bg-yellow-100 text-yellow-700' :
                  t.operationalStatus === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                  t.operationalStatus === 'DELAYED' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {t.operationalStatus || 'OPERATIONAL'}
                </span>
              </div>
              <div className="max-w-20 truncate" title={t.maintenanceNotes || ''}>
                {t.maintenanceNotes || '-'}
              </div>
              <div>
                <span className={`px-2 py-1 rounded text-xs ${
                  t.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {t.isActive !== false ? 'Active' : 'Inactive'}
                </span>
              </div>
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
                {t.isActive !== false ? (
                  <button
                    onClick={() => handleDelete(t.trainId)}
                    className="p-2 rounded hover:bg-red-100 transition"
                    aria-label="Deactivate Train"
                    title="Deactivate Train"
                  >
                    {/* DeleteIcon */}
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={() => handleReactivate(t.trainId)}
                    className="p-2 rounded hover:bg-green-100 transition"
                    aria-label="Reactivate Train"
                    title="Reactivate Train"
                  >
                    {/* ReactivateIcon */}
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ));
          })()}
          {(Array.isArray(trains) ? trains : []).filter(train => showInactive || train.isActive !== false).length === 0 && (
            <div className="text-center text-gray-400 py-8">
              {!Array.isArray(trains) || trains.length === 0 ? "No trains found." : "No active trains found. Check 'Show Inactive Trains' to see all trains."}
            </div>
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-md bg-white/30 backdrop-blur-lg rounded-2xl shadow-lg border border-white/40 p-8">
            <h3 className="text-xl font-bold mb-4 text-blue-900">Confirm Train Deactivation</h3>
            <p className="text-blue-800 mb-6">
              Are you sure you want to deactivate train <strong>{trainToDelete?.trainName}</strong> (ID: {trainToDelete?.trainId})? 
            </p>
            <p className="text-sm text-blue-700 mb-6">
              This will mark the train as inactive but preserve all data. The train can be reactivated later if needed.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Deactivate Train
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainsPage;