import React from "react";

interface InactiveDatesModalProps {
  open: boolean;
  inactiveDates: string[];
  onClose: () => void;
}

const InactiveDatesModal: React.FC<InactiveDatesModalProps> = ({ open, inactiveDates, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-md bg-white/30 backdrop-blur-lg rounded-2xl shadow-lg border border-white/40 p-8">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-blue-900">Train Inactive Dates</h3>
        <div className="flex flex-col gap-3">
          {inactiveDates && inactiveDates.length > 0 ? (
            inactiveDates.map((date, idx) => (
              <div key={idx} className="bg-white/50 rounded-lg px-3 py-2 border">
                <span className="text-blue-800 font-medium">
                  {date ? new Date(date).toLocaleDateString() : 'Invalid Date'}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No inactive dates specified
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default InactiveDatesModal;