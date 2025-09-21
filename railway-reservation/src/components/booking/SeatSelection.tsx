import { useState, useEffect } from 'react';
import { getAvailableSeatNumbers } from '../../services/trainService';

interface SeatSelectionProps {
  trainId: number;
  seatClass: string;
  date: string;
  maxSeats: number;
  onSeatSelect: (seats: number[]) => void;
  price: number;
}

const SeatSelection = ({ trainId, seatClass, date, maxSeats, onSeatSelect, price }: SeatSelectionProps) => {
  const [availableSeats, setAvailableSeats] = useState<number[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableSeats();
  }, [trainId, seatClass, date]);

  const fetchAvailableSeats = async () => {
    try {
      setLoading(true);
      const seats = await getAvailableSeatNumbers(trainId, seatClass, date);
      setAvailableSeats(seats);
    } catch (error) {
      console.error('Error fetching available seats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seatNumber: number) => {
    if (selectedSeats.includes(seatNumber)) {
      const newSelection = selectedSeats.filter(seat => seat !== seatNumber);
      setSelectedSeats(newSelection);
      onSeatSelect(newSelection);
    } else if (selectedSeats.length < maxSeats) {
      const newSelection = [...selectedSeats, seatNumber];
      setSelectedSeats(newSelection);
      onSeatSelect(newSelection);
    }
  };

  const getSeatIcon = (seatClass: string) => {
    switch (seatClass) {
      case 'SLEEPER': return '🛏️';
      case 'AC2': return '❄️';
      case 'AC1': return '⭐';
      default: return '💺';
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

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Loading available seats...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getSeatIcon(seatClass)}</span>
          <h3 className="text-xl font-bold">{getSeatClassName(seatClass)}</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">₹{price}</p>
          <p className="text-sm text-gray-500">per seat</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Select up to {maxSeats} seat{maxSeats > 1 ? 's' : ''} ({selectedSeats.length} selected)
        </p>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span>Occupied</span>
          </div>
        </div>
      </div>

      {/* Seat Map */}
      <div className="grid grid-cols-4 gap-2 max-h-96 overflow-y-auto">
        {Array.from({ length: Math.max(...availableSeats, 0) }, (_, i) => i + 1).map((seatNumber) => {
          const isAvailable = availableSeats.includes(seatNumber);
          const isSelected = selectedSeats.includes(seatNumber);
          
          return (
            <button
              key={seatNumber}
              onClick={() => isAvailable && handleSeatClick(seatNumber)}
              disabled={!isAvailable}
              className={`
                w-12 h-12 rounded-lg font-semibold text-sm transition-colors
                ${isSelected 
                  ? 'bg-blue-500 text-white' 
                  : isAvailable 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }
              `}
            >
              {seatNumber}
            </button>
          );
        })}
      </div>

      {selectedSeats.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2">Selected Seats:</h4>
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedSeats.map(seat => (
              <span key={seat} className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
                {seat}
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Amount:</span>
            <span className="text-xl font-bold text-green-600">
              ₹{(selectedSeats.length * price).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;