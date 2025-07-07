import { useEffect, useMemo, useState } from "react";
import { fetchAvailableTrains } from "../../services/trainService";
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
    
  // pagination 
  const [currentPage, setCurrentPage] = useState(1);
  const [trainsPerPage] = useState(9);
  
  useEffect(() => {
    const getTrains = async () => {
      const data = await fetchAvailableTrains();
      if (data) {
        setTrains(data);
        setFilteredTrains(data);
      }
    };
    getTrains();
  }, []);
  
   const paginationData = useMemo(() => {
    const totalTrains = filteredTrains.length;
    const totalPages = Math.ceil(totalTrains / trainsPerPage);
    const startIndex = (currentPage - 1) * trainsPerPage;
    const endIndex = startIndex + trainsPerPage;
    const currentTrains = filteredTrains.slice(startIndex, endIndex);

    return {
      totalTrains,
      totalPages,
      currentTrains,
      startIndex,
      endIndex: Math.min(endIndex, totalTrains)
    };
  }, [filteredTrains, currentPage, trainsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredTrains]);


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

    const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < paginationData.totalPages) {
      goToPage(currentPage + 1);
    }
  };
  
   const getPageNumbers = () => {
    const pages = [];
    const totalPages = paginationData.totalPages;
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gray-100 pt-20">
      <h1 className="text-3xl font-bold text-cyan-600 mb-6 text-center">Search Trains</h1>
      
      {/* 90-Day Booking Policy Info */}
      <div className="w-full max-w-4xl mb-4">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-800">
                📅 Booking available up to 90 days in advance. Only available trains are shown.
              </p>
            </div>
          </div>
        </div>
      </div>
      
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
      
      {/* Pagination Controls */}
       {filteredTrains.length > 0 && (
        <div className="w-full max-w-7xl mb-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Showing {paginationData.startIndex + 1}-{paginationData.endIndex} of {paginationData.totalTrains} trains
            </span>
            <span>
              Page {currentPage} of {paginationData.totalPages}
            </span>
          </div>
        </div>
      )}

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

        {/* Pagination Controls */}
      {paginationData.totalPages > 1 && (
        <div className="w-full max-w-7xl flex justify-center items-center space-x-2 mb-8">
          {/* Previous Button */}
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex space-x-1">
            {getPageNumbers().map((page, index) => (
              <div key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-sm text-gray-400">...</span>
                ) : (
                  <button
                     onClick={() => goToPage(page as number)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPage === page
                        ? 'bg-cyan-600 text-white border border-cyan-600'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === paginationData.totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
       {/* Quick Jump to Page */}
      {paginationData.totalPages > 5 && (
        <div className="w-full max-w-7xl flex justify-center items-center space-x-2 text-sm text-gray-600">
          <span>Jump to page:</span>
          <input
            type="number"
            min="1"
            max={paginationData.totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= paginationData.totalPages) {
                goToPage(page);
              }
            }}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          <span>of {paginationData.totalPages}</span>
        </div>
      )}
    </div>
  );
};

export default TrainDetails;