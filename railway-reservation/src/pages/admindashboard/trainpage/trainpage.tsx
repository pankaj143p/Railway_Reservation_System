import React, { useEffect, useState, useMemo } from "react";
import { Train } from "../../../interfaces/Train";
import { fetchTrains, addTrain, updateTrain, deleteTrain } from "../../../services/api/trainservice";
import TrainForm from "../../../components/ui/trainform/trainfrom";
import RoutesModal from "../../../components/ui/trainform/trainroutes";
import InactiveDatesModal from "../../../components/ui/trainform/trainInActiveDatesModel";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Alert from '@mui/material/Alert';

const TrainsPage: React.FC = () => {
  const [trains, setTrains] = useState<Train[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTrain, setEditingTrain] = useState<Train | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [trainToDelete, setTrainToDelete] = useState<Train | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // For routes modal
  const [routesModalOpen, setRoutesModalOpen] = useState(false);
  const [routesTrain, setRoutesTrain] = useState<Train | null>(null);

  // For inactive dates modal
  const [inactiveDatesModalOpen, setInactiveDatesModalOpen] = useState(false);
  const [inactiveDatesTrain, setInactiveDatesTrain] = useState<Train | null>(null);

  // Alert state
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadTrains();
  }, []);

  // Reset to first page when showInactive changes
  useEffect(() => {
    setCurrentPage(1);
  }, [showInactive]);

  // Calculate filtered trains and pagination
  const { filteredTrains, totalPages, paginatedTrains } = useMemo(() => {
    const trainsArray = Array.isArray(trains) ? trains : [];
    const filtered = trainsArray.filter(train => showInactive || train.isActive !== false);
    const total = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);

    return {
      filteredTrains: filtered,
      totalPages: total,
      paginatedTrains: paginated
    };
  }, [trains, showInactive, currentPage, itemsPerPage]);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const loadTrains = async () => {
    setLoading(true);
    try {
      console.log("Fetching trains...");
      const data = await fetchTrains();
      console.log("Trains fetched:", data, "Type:", typeof data, "Is Array:", Array.isArray(data));
      
      if (Array.isArray(data)) {
        setTrains(data);
      } else {
        console.error("fetchTrains did not return an array:", data);
        setTrains([]);
      }
    } catch (error) {
      console.error("Error fetching trains:", error);
      setTrains([]);
      showAlert('error', 'Failed to fetch trains. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (train: Partial<Train>) => {
    setLoading(true);
    try {
      console.log("Adding train:", train);
      const newTrain = await addTrain(train);
      console.log("Train added successfully:", newTrain);
      
      // Refresh the trains list to get the latest data
      await loadTrains();
      setFormOpen(false);
      setEditingTrain(null);
      showAlert('success', 'Train added successfully!');
    } catch (err) {
      console.error("Add train error:", err);
      showAlert('error', 'Failed to add train. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (train: Partial<Train>) => {
    if (!editingTrain) {
      console.error("No train selected for editing");
      return;
    }
    
    setLoading(true);
    try {
      console.log("Updating train:", editingTrain.trainId, "with data:", train);
      
      const updatedTrain = await updateTrain(editingTrain.trainId, train);
      console.log("Train updated successfully:", updatedTrain);
      
      // Refresh the trains list to get the latest data
      await loadTrains();
      
      setEditingTrain(null);
      setFormOpen(false);
      showAlert('success', 'Train updated successfully!');
    } catch (err) {
      console.error("Update train error:", err);
      showAlert('error', 'Failed to update train. Please check the console for details.');
    } finally {
      setLoading(false);
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
    
    setLoading(true);
    try {
      console.log("Deactivating train:", trainToDelete.trainId);
      await deleteTrain(trainToDelete.trainId);
      
      // Refresh the trains list
      await loadTrains();
      
      setDeleteConfirmOpen(false);
      setTrainToDelete(null);
      showAlert('success', 'Train deactivated successfully!');
    } catch (err) {
      console.error("Soft delete train error:", err);
      showAlert('error', 'Failed to deactivate train. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setTrainToDelete(null);
  };

  const handleReactivate = async (trainId: number) => {
    setLoading(true);
    try {
      console.log("Reactivating train:", trainId);
      await updateTrain(trainId, { isActive: true });
      
      // Refresh the trains list
      await loadTrains();
      showAlert('success', 'Train reactivated successfully!');
    } catch (err) {
      console.error("Reactivate train error:", err);
      showAlert('error', 'Failed to reactivate train. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 mx-1 rounded-lg bg-white/30 backdrop-blur-lg border border-white/40 text-blue-900 hover:bg-blue-100/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
    );

    // First page button
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-4 py-2 mx-1 rounded-lg bg-white/30 backdrop-blur-lg border border-white/40 text-blue-900 hover:bg-blue-100/50 transition"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1" className="px-2 text-blue-900">...</span>);
      }
    }

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 rounded-lg backdrop-blur-lg border transition ${
            currentPage === i
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-white/30 border-white/40 text-blue-900 hover:bg-blue-100/50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page button
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis2" className="px-2 text-blue-900">...</span>);
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-4 py-2 mx-1 rounded-lg bg-white/30 backdrop-blur-lg border border-white/40 text-blue-900 hover:bg-blue-100/50 transition"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 mx-1 rounded-lg bg-white/30 backdrop-blur-lg border border-white/40 text-blue-900 hover:bg-blue-100/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    );

    return buttons;
  };

  if (loading && trains.length === 0) {
    return (
      <div className="p-4 sm:p-8 min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center">
        <div className="text-blue-900 text-lg">Loading trains...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      {/* Alert Component */}
      {alert && (
        <div className="fixed top-4 right-4 z-50 w-96">
          <Alert 
            variant="outlined" 
            severity={alert.type}
            onClose={() => setAlert(null)}
          >
            {alert.message}
          </Alert>
        </div>
      )}

      <div className="my-16 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Train Management</h2>
          <p className="text-blue-700 text-sm mt-1">
            Showing {paginatedTrains.length} of {filteredTrains.length} trains 
            {filteredTrains.length > itemsPerPage && ` (Page ${currentPage} of ${totalPages})`}
          </p>
        </div>
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
            disabled={loading}
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
          <div>Active</div>
          <div>Routes</div>
          <div>Inactive Dates</div>
          <div>Actions</div>
        </div>

        <div className="flex flex-col gap-4">
          {paginatedTrains.map((t, idx) => (
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
                  disabled={loading}
                >
                  Routes
                </button>
              </div>
              <div>
                <button
                  onClick={() => { setInactiveDatesTrain(t); setInactiveDatesModalOpen(true); }}
                  className="bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200 transition text-xs"
                  disabled={loading}
                >
                  Dates
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingTrain(t); setFormOpen(true); }}
                  className="p-2 rounded hover:bg-yellow-100 transition"
                  aria-label="Edit"
                  disabled={loading}
                >
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
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faTrash} style={{color: "#c92222"}} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleReactivate(t.trainId)}
                    className="p-2 rounded hover:bg-green-100 transition"
                    aria-label="Reactivate Train"
                    title="Reactivate Train"
                    disabled={loading}
                  >
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}

          {paginatedTrains.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              {!Array.isArray(trains) || trains.length === 0 ? "No trains found." : "No active trains found. Check 'Show Inactive Trains' to see all trains."}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-2">
            <div className="flex items-center">
              {renderPaginationButtons()}
            </div>
            <div className="ml-4 text-sm text-blue-700">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        )}
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
      <InactiveDatesModal
        open={inactiveDatesModalOpen}
        inactiveDates={inactiveDatesTrain?.inactiveDates || []}
        onClose={() => { setInactiveDatesModalOpen(false); setInactiveDatesTrain(null); }}
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
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                disabled={loading}
              >
                {loading ? "Processing..." : "Deactivate Train"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainsPage;