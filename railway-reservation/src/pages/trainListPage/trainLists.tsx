import { useEffect, useState } from "react";
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
  const [validationError, setValidationError] = useState("");

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
    // Clear any previous validation errors
    setValidationError("");
    
    // Validate that source and destination are not the same
    if (sourceStation && destinationStation && 
        sourceStation.toLowerCase().trim() === destinationStation.toLowerCase().trim()) {
      setValidationError("Source and destination stations cannot be the same!");
      return;
    }
    
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

  // Handle source station change with validation
  const handleSourceChange = (value: string) => {
    setSourceStation(value);
    // Clear validation error if stations are now different
    if (validationError && value.toLowerCase().trim() !== destinationStation.toLowerCase().trim()) {
      setValidationError("");
    }
  };

  // Handle destination station change with validation  
  const handleDestinationChange = (value: string) => {
    setDestinationStation(value);
    // Clear validation error if stations are now different
    if (validationError && sourceStation.toLowerCase().trim() !== value.toLowerCase().trim()) {
      setValidationError("");
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchDate("");
    setSourceStation("");
    setDestinationStation("");
    setValidationError("");
    setFilteredTrains(trains);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gray-100 pt-20">
      <h1 className="text-3xl font-bold text-cyan-600 mb-6 text-center">Search Trains</h1>
      
      {/* Validation Error Alert */}
      {validationError && (
        <div className="w-full max-w-4xl mb-4">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {validationError}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    onClick={() => setValidationError("")}
                    className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600 transition-colors"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Enhanced Search Form */}
      <div className="bg-gradient-to-l from-cyan-100 to-gray-100 rounded-lg shadow-md p-4 mb-8 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              type="text"
              value={sourceStation}
              onChange={e => handleSourceChange(e.target.value)}
              placeholder="Source station"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input
              type="text"
              value={destinationStation}
              onChange={e => handleDestinationChange(e.target.value)}
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