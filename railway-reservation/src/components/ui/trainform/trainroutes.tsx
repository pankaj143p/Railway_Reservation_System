import React from "react";

interface RoutesModalProps {
  open: boolean;
  routes: string[];
  onClose: () => void;
}

const RoutesModal: React.FC<RoutesModalProps> = ({ open, routes, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-md bg-white/30 backdrop-blur-lg rounded-2xl shadow-lg border border-white/40 p-8 overflow-y-auto max-h-[90vh] custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-blue-900">Train Routes</h3>
        <ul className="list-disc pl-6 space-y-2 text-blue-900">
          {routes && routes.length > 0 ? (
            routes.map((route, idx) => (
              <li key={idx}>{route}</li>
            ))
          ) : (
            <li className="text-gray-500">No routes available.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default RoutesModal;