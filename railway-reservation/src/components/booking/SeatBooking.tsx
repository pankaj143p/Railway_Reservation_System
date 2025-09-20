import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface SeatBookingProps {
  trainId: string;
  trainDetails: any;
  selectedDate: string;
  onBookingComplete: (bookingDetails: any) => void;
  onClose: () => void;
}

interface SeatDetails {
  sleeper: {
    available: number;
    booked: number;
    total: number;
    price: number;
    bookedSeatNumbers: number[];
  };
  ac2: {
    available: number;
    booked: number;
    total: number;
    price: number;
    bookedSeatNumbers: number[];
  };
  ac1: {
    available: number;
    booked: number;
    total: number;
    price: number;
    bookedSeatNumbers: number[];
  };
}

interface BookingRequest {
  trainId: number;
  seatClass: string;
  bookingDate: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  preferredSeatNumber?: number;
  numberOfSeats: number;
}

const SeatBooking: React.FC<SeatBookingProps> = ({ 
  trainId, 
  trainDetails, 
  selectedDate, 
  onBookingComplete, 
  onClose 
}) => {
  const [seatDetails, setSeatDetails] = useState<SeatDetails | null>(null);
  const [selectedClass, setSelectedClass] = useState<'sleeper' | 'ac2' | 'ac1'>('sleeper');
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  
  // Passenger details
  const [passengerName, setPassengerName] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  
  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

  useEffect(() => {
    fetchSeatDetails();
    loadUserDetails();
  }, [trainId, selectedDate]);

  const loadUserDetails = () => {
    // Load user details from localStorage if available
    const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName') || sessionStorage.getItem('userName');
    const userPhone = localStorage.getItem('userPhone') || sessionStorage.getItem('userPhone');
    
    if (userEmail) setPassengerEmail(userEmail);
    if (userName) setPassengerName(userName);
    if (userPhone) setPassengerPhone(userPhone);
  };

  const fetchSeatDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/seats/availability/${trainId}?date=${selectedDate}`
      );
      
      const data = response.data;
      setSeatDetails({
        sleeper: {
          available: data.sleeperAvailableSeats || 0,
          booked: data.sleeperBookedSeats || 0,
          total: data.sleeperTotalSeats || 0,
          price: data.sleeperPrice || 300,
          bookedSeatNumbers: data.sleeperBookedSeatNumbers || []
        },
        ac2: {
          available: data.ac2AvailableSeats || 0,
          booked: data.ac2BookedSeats || 0,
          total: data.ac2TotalSeats || 0,
          price: data.ac2Price || 700,
          bookedSeatNumbers: data.ac2BookedSeatNumbers || []
        },
        ac1: {
          available: data.ac1AvailableSeats || 0,
          booked: data.ac1BookedSeats || 0,
          total: data.ac1TotalSeats || 0,
          price: data.ac1Price || 1300,
          bookedSeatNumbers: data.ac1BookedSeatNumbers || []
        }
      });
    } catch (error) {
      console.error('Error fetching seat details:', error);
      setModalMessage('Failed to load seat information. Please try again.');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const getSeatRange = (seatClass: string) => {
    if (!seatDetails) return { start: 1, end: 1 };
    
    switch (seatClass) {
      case 'sleeper':
        return { start: 1, end: seatDetails.sleeper.total };
      case 'ac2':
        return { start: seatDetails.sleeper.total + 1, end: seatDetails.sleeper.total + seatDetails.ac2.total };
      case 'ac1':
        return { 
          start: seatDetails.sleeper.total + seatDetails.ac2.total + 1, 
          end: seatDetails.sleeper.total + seatDetails.ac2.total + seatDetails.ac1.total 
        };
      default:
        return { start: 1, end: 1 };
    }
  };

  const isSeatBooked = (seatNumber: number, seatClass: string) => {
    if (!seatDetails) return false;
    
    switch (seatClass) {
      case 'sleeper':
        return seatDetails.sleeper.bookedSeatNumbers.includes(seatNumber);
      case 'ac2':
        return seatDetails.ac2.bookedSeatNumbers.includes(seatNumber);
      case 'ac1':
        return seatDetails.ac1.bookedSeatNumbers.includes(seatNumber);
      default:
        return false;
    }
  };

  const handleSeatSelect = (seatNumber: number) => {
    if (isSeatBooked(seatNumber, selectedClass)) return;
    
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else if (selectedSeats.length < numberOfSeats) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleClassChange = (newClass: 'sleeper' | 'ac2' | 'ac1') => {
    setSelectedClass(newClass);
    setSelectedSeats([]);
  };

  const validateBooking = () => {
    if (!passengerName.trim()) {
      setModalMessage('Please enter passenger name');
      setShowErrorModal(true);
      return false;
    }
    
    if (!passengerEmail.trim()) {
      setModalMessage('Please enter passenger email');
      setShowErrorModal(true);
      return false;
    }
    
    if (selectedSeats.length === 0) {
      setModalMessage('Please select at least one seat');
      setShowErrorModal(true);
      return false;
    }
    
    if (selectedSeats.length !== numberOfSeats) {
      setModalMessage(`Please select exactly ${numberOfSeats} seat(s)`);
      setShowErrorModal(true);
      return false;
    }
    
    return true;
  };

  const handleBooking = async () => {
    if (!validateBooking()) return;
    
    setBooking(true);
    try {
      const bookingRequest: BookingRequest = {
        trainId: parseInt(trainId),
        seatClass: selectedClass.toUpperCase(),
        bookingDate: selectedDate,
        passengerName: passengerName.trim(),
        passengerEmail: passengerEmail.trim(),
        passengerPhone: passengerPhone.trim(),
        numberOfSeats: selectedSeats.length
      };

      // If specific seats are selected, book them individually
      const bookingPromises = selectedSeats.map(seatNumber => 
        axios.post(`${API_URL}/seats/book-specific`, null, {
          params: {
            trainId: parseInt(trainId),
            seatNumber,
            seatClass: selectedClass.toUpperCase(),
            bookingDate: selectedDate,
            passengerName: passengerName.trim(),
            passengerEmail: passengerEmail.trim(),
            passengerPhone: passengerPhone.trim()
          }
        })
      );

      const responses = await Promise.all(bookingPromises);
      const bookingDetails = responses.map(response => response.data);
      
      setModalMessage(`Successfully booked ${selectedSeats.length} seat(s)!`);
      setShowSuccessModal(true);
      onBookingComplete(bookingDetails);
      
    } catch (error: any) {
      console.error('Booking error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data || 'Booking failed. Please try again.';
      setModalMessage(errorMessage);
      setShowErrorModal(true);
    } finally {
      setBooking(false);
    }
  };

  const renderSeatGrid = () => {
    if (!seatDetails) return null;
    
    const range = getSeatRange(selectedClass);
    const seats = [];
    
    for (let seatNumber = range.start; seatNumber <= range.end; seatNumber++) {
      const isBooked = isSeatBooked(seatNumber, selectedClass);
      const isSelected = selectedSeats.includes(seatNumber);
      
      seats.push(
        <SeatButton
          key={seatNumber}
          $isBooked={isBooked}
          $isSelected={isSelected}
          onClick={() => handleSeatSelect(seatNumber)}
          disabled={isBooked}
        >
          {seatNumber}
        </SeatButton>
      );
    }
    
    return seats;
  };

  const getCurrentClassDetails = () => {
    if (!seatDetails) return null;
    return seatDetails[selectedClass];
  };

  const calculateTotalPrice = () => {
    const classDetails = getCurrentClassDetails();
    if (!classDetails) return 0;
    return classDetails.price * selectedSeats.length;
  };

  if (loading) {
    return (
      <BookingOverlay>
        <BookingContainer>
          <LoadingMessage>Loading seat information...</LoadingMessage>
        </BookingContainer>
      </BookingOverlay>
    );
  }

  const classDetails = getCurrentClassDetails();

  return (
    <>
      <BookingOverlay>
        <BookingContainer>
          <BookingHeader>
            <h3>Select Seats</h3>
            <CloseButton onClick={onClose}>×</CloseButton>
          </BookingHeader>

          <TrainInfo>
            <h4>{trainDetails?.trainName}</h4>
            <p>{trainDetails?.source} → {trainDetails?.destination}</p>
            <p>Date: {new Date(selectedDate).toLocaleDateString()}</p>
          </TrainInfo>

          <ClassSelector>
            <ClassButton 
              $active={selectedClass === 'sleeper'} 
              onClick={() => handleClassChange('sleeper')}
              disabled={!seatDetails?.sleeper.available}
            >
              Sleeper (₹{seatDetails?.sleeper.price})
              <br />
              <small>{seatDetails?.sleeper.available} available</small>
            </ClassButton>
            <ClassButton 
              $active={selectedClass === 'ac2'} 
              onClick={() => handleClassChange('ac2')}
              disabled={!seatDetails?.ac2.available}
            >
              AC 2-Tier (₹{seatDetails?.ac2.price})
              <br />
              <small>{seatDetails?.ac2.available} available</small>
            </ClassButton>
            <ClassButton 
              $active={selectedClass === 'ac1'} 
              onClick={() => handleClassChange('ac1')}
              disabled={!seatDetails?.ac1.available}
            >
              AC 1st Class (₹{seatDetails?.ac1.price})
              <br />
              <small>{seatDetails?.ac1.available} available</small>
            </ClassButton>
          </ClassSelector>

          <SeatSelection>
            <SeatSelectionHeader>
              <h4>{selectedClass.toUpperCase()} Class - Select Seats</h4>
              <NumberOfSeatsSelector>
                <label>Number of seats: </label>
                <select 
                  value={numberOfSeats} 
                  onChange={(e) => {
                    setNumberOfSeats(parseInt(e.target.value));
                    setSelectedSeats([]);
                  }}
                >
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num} disabled={num > (classDetails?.available || 0)}>
                      {num}
                    </option>
                  ))}
                </select>
              </NumberOfSeatsSelector>
            </SeatSelectionHeader>
            
            <SeatGrid>
              {renderSeatGrid()}
            </SeatGrid>
            
            <SeatLegend>
              <LegendItem>
                <SeatButton $isBooked={false} $isSelected={false} disabled>1</SeatButton>
                <span>Available</span>
              </LegendItem>
              <LegendItem>
                <SeatButton $isBooked={false} $isSelected={true} disabled>2</SeatButton>
                <span>Selected</span>
              </LegendItem>
              <LegendItem>
                <SeatButton $isBooked={true} $isSelected={false} disabled>3</SeatButton>
                <span>Booked</span>
              </LegendItem>
            </SeatLegend>
          </SeatSelection>

          <PassengerDetails>
            <h4>Passenger Details</h4>
            <InputGroup>
              <label>Name *</label>
              <input 
                type="text" 
                value={passengerName} 
                onChange={(e) => setPassengerName(e.target.value)}
                placeholder="Enter passenger name"
                required
              />
            </InputGroup>
            <InputGroup>
              <label>Email *</label>
              <input 
                type="email" 
                value={passengerEmail} 
                onChange={(e) => setPassengerEmail(e.target.value)}
                placeholder="Enter email address"
                required
              />
            </InputGroup>
            <InputGroup>
              <label>Phone</label>
              <input 
                type="tel" 
                value={passengerPhone} 
                onChange={(e) => setPassengerPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </InputGroup>
          </PassengerDetails>

          {selectedSeats.length > 0 && (
            <BookingSummary>
              <h4>Booking Summary</h4>
              <SummaryRow>
                <span>Selected Seats:</span>
                <span>{selectedSeats.join(', ')}</span>
              </SummaryRow>
              <SummaryRow>
                <span>Class:</span>
                <span>{selectedClass.toUpperCase()}</span>
              </SummaryRow>
              <SummaryRow>
                <span>Price per seat:</span>
                <span>₹{classDetails?.price}</span>
              </SummaryRow>
              <SummaryRow>
                <span>Number of seats:</span>
                <span>{selectedSeats.length}</span>
              </SummaryRow>
              <SummaryRow $total>
                <span><strong>Total Amount:</strong></span>
                <span><strong>₹{calculateTotalPrice()}</strong></span>
              </SummaryRow>
            </BookingSummary>
          )}

          <BookingActions>
            <CancelButton onClick={onClose}>Cancel</CancelButton>
            <BookButton 
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 || booking}
            >
              {booking ? 'Booking...' : `Book ${selectedSeats.length} Seat(s)`}
            </BookButton>
          </BookingActions>
        </BookingContainer>
      </BookingOverlay>

      {/* Success Modal */}
      {showSuccessModal && (
        <ModalOverlay>
          <ModalContainer>
            <ModalIcon>✅</ModalIcon>
            <ModalTitle>Booking Successful!</ModalTitle>
            <ModalMessage>{modalMessage}</ModalMessage>
            <ModalButton onClick={() => {
              setShowSuccessModal(false);
              onClose();
            }}>
              OK
            </ModalButton>
          </ModalContainer>
        </ModalOverlay>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <ModalOverlay>
          <ModalContainer>
            <ModalIcon>❌</ModalIcon>
            <ModalTitle>Booking Failed</ModalTitle>
            <ModalMessage>{modalMessage}</ModalMessage>
            <ModalButton onClick={() => setShowErrorModal(false)}>
              OK
            </ModalButton>
          </ModalContainer>
        </ModalOverlay>
      )}
    </>
  );
};

// Styled Components
const BookingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const BookingContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 800px;
  max-width: 95vw;
  max-height: 95vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  h3 {
    margin: 0;
    color: #333;
    font-size: 1.4rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 50%;
  
  &:hover {
    background: #f0f0f0;
  }
`;

const TrainInfo = styled.div`
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  
  h4 {
    margin: 0 0 8px 0;
    color: #2563eb;
    font-size: 1.1rem;
  }
  
  p {
    margin: 4px 0;
    color: #666;
    font-size: 0.9rem;
  }
`;

const ClassSelector = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const ClassButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px;
  border: 2px solid ${props => props.$active ? '#2563eb' : '#d1d5db'};
  background: ${props => props.$active ? '#eff6ff' : 'white'};
  color: ${props => props.$active ? '#2563eb' : '#374151'};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    border-color: #2563eb;
    background: #eff6ff;
  }
  
  small {
    font-size: 0.8rem;
    color: #6b7280;
  }
`;

const SeatSelection = styled.div`
  margin-bottom: 20px;
`;

const SeatSelectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  h4 {
    margin: 0;
    color: #333;
  }
`;

const NumberOfSeatsSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  label {
    font-size: 0.9rem;
    color: #666;
  }
  
  select {
    padding: 4px 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
  }
`;

const SeatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 8px;
  margin-bottom: 16px;
  max-height: 200px;
  overflow-y: auto;
`;

const SeatButton = styled.button<{ $isBooked: boolean; $isSelected: boolean }>`
  width: 40px;
  height: 40px;
  border: 2px solid;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => {
    if (props.$isBooked) {
      return `
        background: #fee2e2;
        border-color: #dc2626;
        color: #991b1b;
        cursor: not-allowed;
      `;
    } else if (props.$isSelected) {
      return `
        background: #dbeafe;
        border-color: #2563eb;
        color: #1d4ed8;
      `;
    } else {
      return `
        background: #f9fafb;
        border-color: #d1d5db;
        color: #374151;
        
        &:hover {
          background: #e5e7eb;
          border-color: #9ca3af;
        }
      `;
    }
  }}
`;

const SeatLegend = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #666;
`;

const PassengerDetails = styled.div`
  margin-bottom: 20px;
  
  h4 {
    margin: 0 0 12px 0;
    color: #333;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 12px;
  
  label {
    display: block;
    margin-bottom: 4px;
    font-size: 0.9rem;
    color: #374151;
    font-weight: 500;
  }
  
  input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.9rem;
    
    &:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 1px #2563eb;
    }
  }
`;

const BookingSummary = styled.div`
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  
  h4 {
    margin: 0 0 12px 0;
    color: #333;
  }
`;

const SummaryRow = styled.div<{ $total?: boolean }>`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #374151;
  
  ${props => props.$total && `
    font-size: 1rem;
    color: #1f2937;
    border-top: 1px solid #d1d5db;
    padding-top: 8px;
    margin-top: 12px;
  `}
`;

const BookingActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  padding: 12px 24px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background: #f9fafb;
  }
`;

const BookButton = styled.button`
  padding: 12px 24px;
  border: none;
  background: #2563eb;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background: #1d4ed8;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.1rem;
  color: #666;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 15000;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  max-width: 400px;
  width: 90%;
`;

const ModalIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;

const ModalTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #1f2937;
`;

const ModalMessage = styled.p`
  margin: 0 0 24px 0;
  color: #6b7280;
  line-height: 1.5;
`;

const ModalButton = styled.button`
  padding: 12px 24px;
  border: none;
  background: #2563eb;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  
  &:hover {
    background: #1d4ed8;
  }
`;

export default SeatBooking;
