// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { fetchTrainList } from "../../services/trainService";
// import { Train } from "../../interfaces/Train";

// const TrainDetails = () => {
//   const [trains, setTrains] = useState<Train[]>([]);
//   const [filteredTrains, setFilteredTrains] = useState<Train[]>([]);
//   const [searchQuery, setSearchQuery] = useState(""); // State for search input
//   const navigate = useNavigate();

//   useEffect(() => {
//     const getTrains = async () => {
//       const data = await fetchTrainList();
//       if (data) {
//         setTrains(data);
//         setFilteredTrains(data); 
//       }
//     };

//     getTrains();
//   }, []);

//   // Handle Search Based on Source, Destination, or Train Name
//   const handleSearch = () => {
//     const query = searchQuery.toLowerCase();
//     const filtered = trains.filter(train =>
//       train.trainName.toLowerCase().includes(query) ||
//       train.source.toLowerCase().includes(query) ||
//       train.destination.toLowerCase().includes(query)
//     );

//     setFilteredTrains(filtered);
//   };

//   // Handle Booking Navigation
//   const handleBooking = (trainId: number) => {
//     navigate(`/book/${trainId}`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Search Trains</h1>
      
//       {/* Search Form */}
//       <div className="flex items-center gap-4 mb-6 w-full max-w-md">
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder="Search by train name, source, or destination"
//           className="px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button 
//           onClick={handleSearch} 
//           className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition duration-300"
//         >
//           Search
//         </button>
//       </div>

//       {/* Display Filtered Trains */}
//       <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredTrains.length > 0 ? (
//           filteredTrains.map((train) => (
//             <div 
//               key={train.trainId} 
//               className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
//             >
//               <h2 className="text-xl font-semibold text-blue-600">{train.trainName}</h2>
//               <p className="text-gray-700"><strong>Source:</strong> {train.source}</p>
//               <p className="text-gray-700"><strong>Destination:</strong> {train.destination}</p>
//               <p className="text-gray-700"><strong>Total Seats:</strong> {train.totalSeats}</p>
//               <p className={`text-sm font-bold ${
//                 train.status === "ON_TIME" ? "text-green-600" : "text-red-600"
//               }`}>
//                 Status: {train.status}
//               </p>
//               <p className="text-gray-700"><strong>Departure:</strong> {train.departureTime}</p>
//               <p className="text-gray-700"><strong>Arrival:</strong> {train.arrivalTime}</p>

//               <button 
//                 onClick={() => handleBooking(train.trainId)}
//                 className="mt-4 px-4 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition duration-300"
//               >
//                 Book Now
//               </button>
//             </div>
//           ))
//         ) : (
//           <p className="text-red-600 text-lg font-semibold">No trains found matching your search!</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TrainDetails;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTrainList } from "../../services/trainService";
import { Train } from "../../interfaces/Train";

const TrainDetails = () => {
  const [trains, setTrains] = useState<Train[]>([]);
  const [filteredTrains, setFilteredTrains] = useState<Train[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const navigate = useNavigate();

  useEffect(() => {
    const getTrains = async () => {
      const data = await fetchTrainList();
      if (data) {
        setTrains(data);
        setFilteredTrains(data); 
      }
    };

    getTrains();
  }, []);

  // Handle Search Based on Source, Destination, or Train Name
  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = trains.filter(train =>
      train.trainName.toLowerCase().includes(query) ||
      train.source.toLowerCase().includes(query) ||
      train.destination.toLowerCase().includes(query)
    );

    setFilteredTrains(filtered);
  };

  // Handle Booking Navigation
  const handleBooking = (trainId: number) => {
    navigate(`/book/${trainId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Search Trains</h1>
      
      {/* Search Form */}
      <div className="flex items-center gap-4 mb-6 w-full max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by train name, source, or destination"
          className="px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleSearch} 
          className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition duration-300"
        >
          Search
        </button>
      </div>

      {/* Display Filtered Trains */}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrains.length > 0 ? (
          filteredTrains.map((train) => (
            <div 
              key={train.trainId} 
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-blue-600">{train.trainName}</h2>
              <p className="text-gray-700"><strong>Source:</strong> {train.source}</p>
              <p className="text-gray-700"><strong>Destination:</strong> {train.destination}</p>
              <p className="text-gray-700"><strong>Total Seats:</strong> {train.totalSeats}</p>
              <p className={`text-sm font-bold ${
                train.status === "ON_TIME" ? "text-green-600" : "text-red-600"
              }`}>
                Status: {train.status}
              </p>
              <p className="text-gray-700"><strong>Departure:</strong> {train.departureTime}</p>
              <p className="text-gray-700"><strong>Arrival:</strong> {train.arrivalTime}</p>

              <button 
                onClick={() => handleBooking(train.trainId)}
                className="mt-4 px-4 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition duration-300"
              >
                Book Now
              </button>
            </div>
          ))
        ) : (
          <p className="text-red-600 text-lg font-semibold">No trains found matching your search!</p>
        )}
      </div>
    </div>
  );
};

export default TrainDetails;