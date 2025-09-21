import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrainSearchResult } from '../interfaces/Train';
import { searchTrainsWithAvailability } from '../services/trainService';

const SearchTrain = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [searchResults, setSearchResults] = useState<TrainSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    setValidationError('');
    
    if (!source || !destination || !date) {
      setValidationError('Please fill all required fields');
      return;
    }
    
    if (source.toLowerCase().trim() === destination.toLowerCase().trim()) {
      setValidationError('Source and destination cannot be the same');
      return;
    }
    
    const searchDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (searchDate < today) {
      setValidationError('Cannot search for past dates');
      return;
    }
    
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);
    
    if (searchDate > maxDate) {
      setValidationError('Booking available only up to 90 days in advance');
      return;
    }
    
    setIsSearching(true);
    
    try {
      const results = await searchTrainsWithAvailability(source, destination, date);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setValidationError('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookTrain = (trainId: number, seatClass: string) => {
    navigate(`/book/${trainId}?date=${date}&class=${seatClass}`);
  };

  const getSeatClassIcon = (seatClass: string) => {
    switch (seatClass) {
      case 'SLEEPER': return '🛏️';
      case 'AC2': return '❄️';
      case 'AC1': return '⭐';
      default: return '🚂';
    }
  };

  const getSeatClassName = (seatClass: string) => {
    switch (seatClass) {
      case 'SLEEPER': return 'Sleeper';
      case 'AC2': return 'AC 2-Tier';
      case 'AC1': return 'AC 1-Tier';
      default: return seatClass;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">
          🚂 Search Trains
        </h1>
        
        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Source station"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Destination station"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                max={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSearching ? 'Searching...' : 'Search Trains'}
              </button>
            </div>
          </div>
          
          {validationError && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {validationError}
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Available Trains ({searchResults.length})
            </h2>
            
            {searchResults.map((train) => (
              <div key={train.trainId} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{train.trainName}</h3>
                    <p className="text-gray-600">{train.source} → {train.destination}</p>
                    <p className="text-sm text-gray-500">
                      Departure: {train.departureTime} | Arrival: {train.arrivalTime}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      train.operationalStatus === 'OPERATIONAL' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {train.operationalStatus}
                    </span>
                  </div>
                </div>
                
                {/* Seat Classes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {train.seatAvailability.map((seatClass) => (
                    <div key={seatClass.seatClass} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getSeatClassIcon(seatClass.seatClass)}</span>
                          <span className="font-semibold">{getSeatClassName(seatClass.seatClass)}</span>
                        </div>
                        <span className="text-lg font-bold text-green-600">₹{seatClass.price}</span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        <p>Available: {seatClass.availableSeats}/{seatClass.totalSeats}</p>
                        <p>Seats: {seatClass.seatRangeStart}-{seatClass.seatRangeEnd}</p>
                      </div>
                      
                      <button
                        onClick={() => handleBookTrain(train.trainId, seatClass.seatClass)}
                        disabled={seatClass.availableSeats === 0}
                        className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                          seatClass.availableSeats > 0
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {seatClass.availableSeats > 0 ? 'Book Now' : 'Sold Out'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {searchResults.length === 0 && !isSearching && source && destination && date && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚂</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No trains found</h3>
            <p className="text-gray-500">Try different stations or dates</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTrain;