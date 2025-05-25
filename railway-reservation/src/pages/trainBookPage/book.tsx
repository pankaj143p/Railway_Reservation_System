import { useParams } from "react-router-dom";

const BookTrain = () => {
  const { trainId } = useParams();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Book Your Train</h1>
      <p className="text-lg">You're booking train ID: <strong>{trainId}</strong></p>

      {/* Booking form */}
      <input 
        type="number"
        placeholder="Enter number of seats"
        className="px-4 py-2 border border-gray-300 rounded-md mt-4"
      />
      <button 
        className="mt-4 px-6 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition duration-300"
      >
        Confirm Booking
      </button>
    </div>
  );
};

export default BookTrain;