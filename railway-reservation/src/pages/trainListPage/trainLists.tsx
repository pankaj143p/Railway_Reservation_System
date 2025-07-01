import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTrainList } from "../../services/trainService";
import { Train } from "../../interfaces/Train";
import Card from "../../components/ui/card/Card";

const TrainDetails = () => {
  const [trains, setTrains] = useState<Train[]>([]);
  const [filteredTrains, setFilteredTrains] = useState<Train[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  // @ts-ignore - searchDate is used in form input but TypeScript doesn't detect it
  const [searchDate, setSearchDate] = useState("");
  const [sourceStation, setSourceStation] = useState("");
  const [destinationStation, setDestinationStation] = useState("");
  const [isSearching, setIsSearching] = useState(false);
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

  const handleSearch = async () => {
    setIsSearching(true);
    
    try {
      // Simple text search
      const query = searchQuery.toLowerCase();
      let filtered = trains.filter(train =>
        train.trainName.toLowerCase().includes(query) ||
        train.source.toLowerCase().includes(query) ||
        train.destination.toLowerCase().includes(query)
      );

      // Additional filtering by station if provided
      if (sourceStation) {
        filtered = filtered.filter(train =>
          train.source.toLowerCase().includes(sourceStation.toLowerCase())
        );
      }
      
      if (destinationStation) {
        filtered = filtered.filter(train =>
          train.destination.toLowerCase().includes(destinationStation.toLowerCase())
        );
      }

      setFilteredTrains(filtered);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBooking = (trainId: number) => {
    navigate(`/book/${trainId}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchDate("");
    setSourceStation("");
    setDestinationStation("");
    setFilteredTrains(trains);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gray-100 pt-20">
      <h1 className="text-3xl font-bold text-cyan-600 mb-6 text-center">Search Trains</h1>
      
      {/* Enhanced Search Form */}
      <div className="bg-gradient-to-l from-cyan-100 to-gray-100 rounded-lg shadow-md p-4 mb-8 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              type="text"
              value={sourceStation}
              onChange={e => setSourceStation(e.target.value)}
              placeholder="Source station"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input
              type="text"
              value={destinationStation}
              onChange={e => setDestinationStation(e.target.value)}
              placeholder="Destination station"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
            <input
              type="date"
              value={searchDate}
              onChange={e => setSearchDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div> */}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Or Search By Name</label>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Train name, route..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          
          <div className="flex flex-col justify-end space-y-2">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-4 py-2 bg-cyan-600 text-white font-bold rounded-md hover:bg-cyan-700 transition disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
            <button
              onClick={clearSearch}
              className="px-4 py-2 bg-gray-500 text-white font-bold rounded-md hover:bg-gray-600 transition text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {filteredTrains.length > 0 ? (
          filteredTrains.map(train => (
            <Card
              key={train.trainId}
              train={train}
              onBook={() => handleBooking(train.trainId)}
            />
          ))
        ) : (
          <p className="text-red-600 text-lg font-semibold col-span-full text-center">
            No trains found matching your search!
          </p>
        )}
      </div>
    </div>
  );
};

export default TrainDetails;