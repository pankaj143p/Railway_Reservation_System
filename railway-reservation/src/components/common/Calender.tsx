import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface CalendarProps {
  trainId: string;
  trainDetails: any;
  onDateSelect: (date: string) => void;
  onClose: () => void;
}

interface SeatAvailability {
  date: string;
  availableSeats: number;
  bookedSeats: number;
  totalSeats: number;
  status: 'available' | 'full' | 'unavailable' | 'train-not-operational';
  operationalReason?: string;
}

const Calendar: React.FC<CalendarProps> = ({ trainId, trainDetails, onDateSelect, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [seatAvailability, setSeatAvailability] = useState<{ [key: string]: SeatAvailability }>({});
  const [loading, setLoading] = useState(false);
  const [internalSelectedDate, setInternalSelectedDate] = useState<string>('');
  
  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [selectedDateFormatted, setSelectedDateFormatted] = useState('');

  const API_URL = import.meta.env.VITE_API_GATEWAY_URL;
  const navigate = useNavigate();

  // Check if user is logged in
  const isUserLoggedIn = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return !!token;
  };

  useEffect(() => {
    fetchSeatAvailability();
  }, [currentMonth, trainId]);

  const fetchSeatAvailability = async () => {
    setLoading(true);
    try {
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      const availability: { [key: string]: SeatAvailability } = {};
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxBookingDate = new Date(today);
      maxBookingDate.setDate(maxBookingDate.getDate() + 90);
      maxBookingDate.setHours(23, 59, 59, 999);
      
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        const currentDateForComparison = new Date(year, month, day);
        currentDateForComparison.setHours(0, 0, 0, 0);
        
        if (currentDateForComparison < today) {
          availability[dateStr] = {
            date: dateStr,
            availableSeats: 0,
            bookedSeats: 0,
            totalSeats: trainDetails?.totalSeats || 0,
            status: 'unavailable'
          };
        } else if (currentDateForComparison > maxBookingDate) {
          availability[dateStr] = {
            date: dateStr,
            availableSeats: 0,
            bookedSeats: 0,
            totalSeats: trainDetails?.totalSeats || 0,
            status: 'unavailable'
          };
        } else {
          try {
            const response = await axios.get(
              `${API_URL}/tickets/availability/${trainId}?date=${dateStr}`
            );
            
            const bookedSeats = response.data;
            const totalSeats = trainDetails?.totalSeats || 0;
            const availableSeats = totalSeats - bookedSeats;
            
            availability[dateStr] = {
              date: dateStr,
              availableSeats,
              bookedSeats,
              totalSeats,
              status: availableSeats <= 0 ? 'full' : 'available'
            };
          } catch (error) {
            const dayOfMonth = day;
            let demoStatus = 'available';
            
            if (dayOfMonth === 25 || dayOfMonth === 28) {
              demoStatus = 'full';
            }
            
            availability[dateStr] = {
              date: dateStr,
              availableSeats: demoStatus === 'full' ? 0 : trainDetails?.totalSeats || 0,
              bookedSeats: demoStatus === 'full' ? trainDetails?.totalSeats || 0 : 0,
              totalSeats: trainDetails?.totalSeats || 0,
              status: demoStatus as 'available' | 'full'
            };
          }
        }
      }
      
      setSeatAvailability(availability);
    } catch (error) {
      console.error('Error fetching seat availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectedDate = (selectedDate: string) => {
    setInternalSelectedDate(selectedDate);
    
    const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
    
    setSelectedDateFormatted(formattedDate);
    
    localStorage.setItem('selectedTravelDate', selectedDate);
    localStorage.setItem('selectedTrainId', trainId);
    
    // const bookingData = {
    //   trainId: trainId,
    //   date: selectedDate,
    //   trainName: trainDetails?.trainName,
    //   route: `${trainDetails?.source} → ${trainDetails?.destination}`,
    //   totalSeats: trainDetails?.totalSeats,
    //   availableSeats: seatAvailability[selectedDate]?.availableSeats || 0,
    //   timestamp: new Date().toISOString()
    // };
    
    setShowSuccessModal(true);
    onDateSelect(selectedDate);
  };

  const checkTrainOperationalStatus = async (dateStr: string): Promise<{isOperational: boolean, reason?: string}> => {
    try {
      const trainStatusResponse = await axios.get(
        `${API_URL}/trains/operational-status/${trainId}?date=${dateStr}`
      );
      
      const trainStatus = trainStatusResponse.data;
      
      return {
        isOperational: trainStatus==="OPERATIONAL",
        reason: trainStatus.reason
      };
    } catch (error) {
      console.error(`Error checking operational status for ${dateStr}:`, error);
      
      const dayOfMonth = new Date(dateStr).getDate();
      
      if (dayOfMonth === 15) {
        return { isOperational: false, reason: 'Scheduled maintenance' };
      } else if (dayOfMonth === 22) {
        return { isOperational: false, reason: 'Track repair work' };
      } else if (dayOfMonth === 30) {
        return { isOperational: false, reason: 'Weather conditions' };
      }
      
      return { isOperational: true };
    }
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      days.push({
        day,
        date: dateStr,
        availability: seatAvailability[dateStr]
      });
    }
    
    return days;
  };

  const handleDateClick = async (dateStr: string, availability: SeatAvailability) => {
    // Check if user is logged in first
    if (!isUserLoggedIn()) {
      const formattedDate = new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      setSelectedDateFormatted(formattedDate);
      setShowLoginModal(true);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const clickedDate = new Date(dateStr);
    clickedDate.setHours(0, 0, 0, 0);
    const maxBookingDate = new Date(today);
    maxBookingDate.setDate(maxBookingDate.getDate() + 90);
    maxBookingDate.setHours(0, 0, 0, 0);
    
    if (clickedDate.getTime() < today.getTime()) {
      setModalMessage("Cannot book past dates");
      setShowErrorModal(true);
      return;
    }
    
    if (clickedDate.getTime() > maxBookingDate.getTime()) {
      setModalMessage(`Booking not available beyond 90 days from today`);
      setShowErrorModal(true);
      return;
    }
    
    if (availability.status === 'available' || availability.status === 'full') {
      setLoading(true);
      
      try {
        const operationalStatus = await checkTrainOperationalStatus(dateStr);
        
        if (!operationalStatus.isOperational) {
          setModalMessage(`Train not operational on ${new Date(dateStr).toLocaleDateString()}\nReason: ${operationalStatus.reason || 'Service unavailable'}`);
          setShowErrorModal(true);
          
          setSeatAvailability(prev => ({
            ...prev,
            [dateStr]: {
              ...availability,
              status: 'train-not-operational',
              operationalReason: operationalStatus.reason
            }
          }));
          
          return;
        }
        
        if (availability.status === 'available') {
          handleSelectedDate(dateStr);
        } else if (availability.status === 'full') {
          setModalMessage("No seats available for this date");
          setShowErrorModal(true);
        }
        
      } catch (error) {
        console.error('Error checking operational status:', error);
        setModalMessage('Unable to verify train operational status. Please try again.');
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    } else if (availability.status === 'train-not-operational') {
      setModalMessage(`Train not operational on ${new Date(dateStr).toLocaleDateString()}\nReason: ${availability.operationalReason || 'Service unavailable'}`);
      setShowErrorModal(true);
    } else {
      setModalMessage("This date is not available for booking");
      setShowErrorModal(true);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && !canNavigatePrev()) return;
    if (direction === 'next' && !canNavigateNext()) return;
    
    const newMonth = new Date(currentMonth);
    
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    
    setCurrentMonth(newMonth);
  };

  const formatMonthYear = () => {
    return currentMonth.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const canNavigatePrev = () => {
    const today = new Date();
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    
    return !(prevMonth.getFullYear() < today.getFullYear() || 
            (prevMonth.getFullYear() === today.getFullYear() && prevMonth.getMonth() < today.getMonth()));
  };

  const canNavigateNext = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 90);
    maxDate.setHours(0, 0, 0, 0);
    
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const firstDayOfNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
    firstDayOfNextMonth.setHours(0, 0, 0, 0);
    
    return firstDayOfNextMonth.getTime() <= maxDate.getTime();
  };

  const days = getDaysInMonth();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <>
      <CalendarOverlay>
        <CalendarContainer>
          <CalendarHeader>
            <h3>Select Travel Date</h3>
            <CloseButton onClick={onClose}>×</CloseButton>
          </CalendarHeader>
          
          <TrainInfo>
            <h4>{trainDetails?.trainName}</h4>
            <p>{trainDetails?.source} → {trainDetails?.destination}</p>
            <p>Total Seats: {trainDetails?.totalSeats}</p>
          </TrainInfo>

          {internalSelectedDate && (
            <SelectedDateInfo>
              <h4> Selected Date</h4>
              <p>{selectedDateFormatted}</p>
              <ConfirmButton onClick={() => {
                setShowSuccessModal(false);
                onClose();
              }}>
                🎫 Confirm & Proceed
              </ConfirmButton>
              <ClearButton onClick={() => {
                setInternalSelectedDate('');
                setSelectedDateFormatted('');
              }}>
                 Clear Selection
              </ClearButton>
            </SelectedDateInfo>
          )}

          <CalendarNavigation>
            <NavButton 
              onClick={() => navigateMonth('prev')}
              disabled={!canNavigatePrev()}
            >
              ‹
            </NavButton>
            <MonthYear>{formatMonthYear()}</MonthYear>
            <NavButton 
              onClick={() => navigateMonth('next')}
              disabled={!canNavigateNext()}
            >
              ›
            </NavButton>
          </CalendarNavigation>

          <DaysHeader>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <DayHeaderCell key={day}>{day}</DayHeaderCell>
            ))}
          </DaysHeader>

          <CalendarGrid>
            {days.map((day, index) => (
              <DayCell 
                key={index}
                isEmpty={!day}
                status={day?.availability?.status}
                isToday={day?.date === todayStr}
                isSelected={day?.date === internalSelectedDate}
                onClick={() => day?.availability && handleDateClick(day.date, day.availability)}
              >
                {day && (
                  <>
                    <DayNumber>{day.day}</DayNumber>
                    {day.availability && (
                      <SeatInfo>
                        <SeatCount>{day.availability.availableSeats}</SeatCount>
                      </SeatInfo>
                    )}
                  </>
                )}
              </DayCell>
            ))}
          </CalendarGrid>

          <Legend>
            <LegendItem>
              <LegendColor status="available" />
              <span>Available</span>
            </LegendItem>
            <LegendItem>
              <LegendColor status="full" />
              <span>Full</span>
            </LegendItem>
            <LegendItem>
              <LegendColor status="train-not-operational" />
              <span>Train Not Running</span>
            </LegendItem>
            <LegendItem>
              <LegendColor status="unavailable" />
              <span>Past/Beyond 90 days</span>
            </LegendItem>
          </Legend>

          <BookingPolicy>
            <span> Booking available up to 90 days in advance only</span>
            <br />
            <span> Train operational status checked when you click a date</span>
            <br />
            <small>Click on any green date to check availability and operational status</small>
          </BookingPolicy>

          {loading && <LoadingOverlay>Loading...</LoadingOverlay>}
        </CalendarContainer>
      </CalendarOverlay>

      {/* Success Modal */}
      {showSuccessModal && (
        <ModalOverlay>
          <ModalContainer $type="success">
            <ModalIcon></ModalIcon>
            <ModalTitle>Date Selected Successfully!</ModalTitle>
            <ModalMessage>
              <strong>Travel Date:</strong> {selectedDateFormatted}
              <br />
              <strong>Train:</strong> {trainDetails?.trainName}
              <br />
              <strong>Route:</strong> {trainDetails?.source} → {trainDetails?.destination}
              <br />
              <strong>Available Seats:</strong> {seatAvailability[internalSelectedDate]?.availableSeats || 0}
            </ModalMessage>
            <ModalButtonGroup>
              <ModalButton 
                $type="primary" 
                onClick={() => {
                  setShowSuccessModal(false);
                  onClose();
                }}
              >
                 Proceed to Booking
              </ModalButton>
              <ModalButton 
                $type="secondary" 
                onClick={() => setShowSuccessModal(false)}
              >
                Select Another Date
              </ModalButton>
            </ModalButtonGroup>
          </ModalContainer>
        </ModalOverlay>
      )}

      {/* Login Required Modal */}
      {showLoginModal && (
        <ModalOverlay>
          <ModalContainer $type="warning">
            <ModalIcon>🔐</ModalIcon>
            <ModalTitle>Login Required</ModalTitle>
            <ModalMessage>
              You need to login to book tickets for <strong>{selectedDateFormatted}</strong>
              <br />
              <br />
              Please login or create an account to continue with your booking.
            </ModalMessage>
            <ModalButtonGroup>
              <ModalButton 
                $type="primary" 
                onClick={() => {
                  setShowLoginModal(false);
                  onClose();
                  navigate('/login');
                }}
              >
                 Go to Login
              </ModalButton>
              <ModalButton 
                $type="secondary" 
                onClick={() => {
                  setShowLoginModal(false);
                  onClose();
                  navigate('/register');
                }}
              >
                 Create Account
              </ModalButton>
              <ModalButton 
                $type="tertiary" 
                onClick={() => setShowLoginModal(false)}
              >
                Cancel
              </ModalButton>
            </ModalButtonGroup>
          </ModalContainer>
        </ModalOverlay>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <ModalOverlay>
          <ModalContainer $type="error">
            <ModalIcon></ModalIcon>
            <ModalTitle>Booking Not Available</ModalTitle>
            <ModalMessage>
              {modalMessage.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < modalMessage.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </ModalMessage>
            <ModalButtonGroup>
              <ModalButton 
                $type="primary" 
                onClick={() => setShowErrorModal(false)}
              >
                OK
              </ModalButton>
            </ModalButtonGroup>
          </ModalContainer>
        </ModalOverlay>
      )}
    </>
  );
};

// Existing styled components remain the same...
const CalendarOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const CalendarContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 400px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const CalendarHeader = styled.div`
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

const SelectedDateInfo = styled.div`
  background: #dcfce7;
  border: 2px solid #16a34a;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  text-align: center;
  
  h4 {
    margin: 0 0 8px 0;
    color: #166534;
    font-size: 1.1rem;
  }
  
  p {
    margin: 4px 0 12px 0;
    color: #166534;
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

const ConfirmButton = styled.button`
  background: #16a34a;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  margin-right: 8px;
  
  &:hover {
    background: #15803d;
  }
`;

const ClearButton = styled.button`
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  
  &:hover {
    background: #b91c1c;
  }
`;

const CalendarNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const NavButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? '#9ca3af' : '#2563eb'};
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 18px;
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  &:hover {
    background: ${props => props.disabled ? '#9ca3af' : '#1d4ed8'};
  }
`;

const MonthYear = styled.h4`
  margin: 0;
  color: #333;
  font-size: 1.2rem;
`;

const DaysHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 8px;
`;

const DayHeaderCell = styled.div`
  text-align: center;
  font-weight: 600;
  color: #666;
  font-size: 0.8rem;
  padding: 8px 4px;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 16px;
`;

interface DayCellProps {
  isEmpty?: boolean;
  status?: 'available' | 'full' | 'unavailable' | 'train-not-operational';
  isToday?: boolean;
  isSelected?: boolean;
}

const DayCell = styled.div<DayCellProps>`
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: ${props => props.status === 'available' ? 'pointer' : 'default'};
  font-size: 0.85rem;
  position: relative;
  min-height: 45px;
  
  ${props => props.isEmpty && `
    visibility: hidden;
  `}
  
  ${props => props.status === 'available' && `
    background: #dcfce7;
    color: #166534;
    border: 2px solid #16a34a;
    
    &:hover {
      background: #bbf7d0;
      transform: scale(1.05);
    }
  `}
  
  ${props => props.status === 'full' && `
    background: #fee2e2;
    color: #991b1b;
    border: 2px solid #dc2626;
  `}
  
  ${props => props.status === 'train-not-operational' && `
    background: #fef3c7;
    color: #92400e;
    border: 2px solid #f59e0b;
    position: relative;
    
    &:before {
      content: '🚫';
      position: absolute;
      top: 2px;
      right: 2px;
      font-size: 0.6rem;
    }
  `}
  
  ${props => props.status === 'unavailable' && `
    background: #f3f4f6;
    color: #9ca3af;
    border: 2px solid #d1d5db;
  `}
  
  ${props => props.isToday && `
    box-shadow: 0 0 0 2px #fbbf24;
  `}
  
  ${props => props.isSelected && `
    box-shadow: 0 0 0 3px #8b5cf6;
    background: #f3e8ff !important;
    
    &:after {
      content: '✓';
      position: absolute;
      bottom: 2px;
      right: 2px;
      font-size: 0.7rem;
      color: #8b5cf6;
      font-weight: bold;
    }
  `}
`;

const DayNumber = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
`;

const SeatInfo = styled.div`
  font-size: 0.7rem;
  margin-top: 2px;
`;

const SeatCount = styled.div`
  font-weight: 500;
`;

const Legend = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #666;
`;

const LegendColor = styled.div<{ status: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  
  ${props => props.status === 'available' && `
    background: #16a34a;
  `}
  
  ${props => props.status === 'full' && `
    background: #dc2626;
  `}
  
  ${props => props.status === 'train-not-operational' && `
    background: #f59e0b;
  `}
  
  ${props => props.status === 'unavailable' && `
    background: #9ca3af;
  `}
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  font-weight: 500;
  color: #2563eb;
`;

const BookingPolicy = styled.div`
  text-align: center;
  margin-top: 12px;
  padding: 8px;
  background: #f0f9ff;
  border-radius: 6px;
  font-size: 0.8rem;
  color: #0369a1;
  border: 1px solid #e0f2fe;
`;

// New Modal Styled Components
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
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContainer = styled.div<{ $type: 'success' | 'error' | 'warning' }>`
  background: white;
  border-radius: 16px;
  padding: 32px 24px;
  width: 400px;
  max-width: 90vw;
  text-align: center;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
  transform: scale(0.9);
  animation: modalAppear 0.3s ease-out forwards;
  
  ${props => props.$type === 'success' && `
    border-top: 4px solid #16a34a;
  `}
  
  ${props => props.$type === 'error' && `
    border-top: 4px solid #dc2626;
  `}
  
  ${props => props.$type === 'warning' && `
    border-top: 4px solid #f59e0b;
  `}
  
  @keyframes modalAppear {
    to {
      transform: scale(1);
    }
  }
`;

const ModalIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
  animation: bounceIn 0.6s ease-out;
  
  @keyframes bounceIn {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.05); }
    70% { transform: scale(0.9); }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const ModalTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
`;

const ModalMessage = styled.div`
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 24px;
  
  strong {
    color: #374151;
    font-weight: 500;
  }
`;

const ModalButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  @media (min-width: 480px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const ModalButton = styled.button<{ $type: 'primary' | 'secondary' | 'tertiary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 120px;
  
  ${props => props.$type === 'primary' && `
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }
  `}
  
  ${props => props.$type === 'secondary' && `
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    
    &:hover {
      background: #e5e7eb;
      transform: translateY(-1px);
    }
  `}
  
  ${props => props.$type === 'tertiary' && `
    background: transparent;
    color: #6b7280;
    
    &:hover {
      background: #f9fafb;
      color: #374151;
    }
  `}
`;

export default Calendar;