import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

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
  operationalReason?: string; // Reason why train is not operational (maintenance, cancelled, etc.)
}

const Calendar: React.FC<CalendarProps>= ({ trainId, trainDetails, onDateSelect, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [seatAvailability, setSeatAvailability] = useState<{ [key: string]: SeatAvailability }>({});
  const [loading, setLoading] = useState(false);
  const [internalSelectedDate, setInternalSelectedDate] = useState<string>('');

  const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

  useEffect(() => {
    fetchSeatAvailability();
  }, [currentMonth, trainId]);

  const fetchSeatAvailability = async () => {
    setLoading(true);
    try {
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      const availability: { [key: string]: SeatAvailability } = {};
      
      // Calculate 90 days from today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxBookingDate = new Date(today);
      maxBookingDate.setDate(maxBookingDate.getDate() + 90);
      maxBookingDate.setHours(23, 59, 59, 999); // Set to end of day for comparison
      
      // Fetch availability for each day of the month
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        // ✅ Fix: Create date string directly to avoid timezone issues
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        const currentDateForComparison = new Date(year, month, day);
        currentDateForComparison.setHours(0, 0, 0, 0);
        
        if (currentDateForComparison < today) {
          // Past dates are unavailable
          availability[dateStr] = {
            date: dateStr,
            availableSeats: 0,
            bookedSeats: 0,
            totalSeats: trainDetails?.totalSeats || 0,
            status: 'unavailable'
          };
          console.log(`Date ${dateStr} marked as PAST/UNAVAILABLE`);
        } else if (currentDateForComparison > maxBookingDate) {
          // Dates beyond 90 days are unavailable
          availability[dateStr] = {
            date: dateStr,
            availableSeats: 0,
            bookedSeats: 0,
            totalSeats: trainDetails?.totalSeats || 0,
            status: 'unavailable'
          };
        } else {
          try {
            // Only call ticket availability API for dates within booking window
            const response = await axios.get(
              `${API_URL}/tickets/availability/${trainId}?date=${dateStr}`,
              {
                // headers: {
                //   Authorization: `Bearer ${token}`,
                // },
              }
            );
            
            const bookedSeats = response.data;
            console.log("Booked seats for date", dateStr, ":", bookedSeats);
            
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
            console.error(`Error fetching availability for ${dateStr}:`, error);
            
            // For demonstration: Add some sample operational statuses
            const dayOfMonth = day; // Use the actual day instead of creating new Date
            let demoStatus = 'available';
            
            // Demo: Show some dates as full for testing
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

  // ✅ Internal date handling function
  const handleSelectedDate = (selectedDate: string) => {
    console.log('🎯 Date selected from calendar:', selectedDate);
    
    // ✅ Set internal state
    setInternalSelectedDate(selectedDate);
    
    // ✅ Format date for display
    const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
    
    console.log('📅 Formatted date:', formattedDate);
    
    // ✅ Store in local storage
    localStorage.setItem('selectedTravelDate', selectedDate);
    localStorage.setItem('selectedTrainId', trainId);
    
    // ✅ Prepare booking data
    const bookingData = {
      trainId: trainId,
      date: selectedDate,
      trainName: trainDetails?.trainName,
      route: `${trainDetails?.source} → ${trainDetails?.destination}`,
      totalSeats: trainDetails?.totalSeats,
      availableSeats: seatAvailability[selectedDate]?.availableSeats || 0,
      timestamp: new Date().toISOString()
    };
    
    console.log('🎫 Booking data prepared:', bookingData);
    
    // ✅ Show confirmation
    alert(`✅ Travel date selected: ${formattedDate}`);
    
    // ✅ Call the parent component's onDateSelect
    onDateSelect(selectedDate);
  };

  // ✅ Optional: Booking function
  const proceedWithBooking = async (bookingData: any) => {
    try {
      console.log('🚀 Starting booking process with:', bookingData);
      
      // Example API call
      const response = await axios.post(`${API_URL}/bookings/initiate`, bookingData, {
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('✅ Booking initiated:', response.data);
      alert(`Booking initiated for ${bookingData.date}!`);
      
    } catch (error) {
      console.error('❌ Booking failed:', error);
      alert('Failed to initiate booking. Please try again.');
    }
  };

  // ✅ Check train operational status - called only when date is clicked
  const checkTrainOperationalStatus = async (dateStr: string): Promise<{isOperational: boolean, reason?: string}> => {
    try {
      console.log(`🔍 Checking train operational status for ${dateStr}...`);
      
      const trainStatusResponse = await axios.get(
        `${API_URL}/trains/operational-status/${trainId}?date=${dateStr}`,
        {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        }
      );
      
      const trainStatus = trainStatusResponse.data;
      console.log("Train operational status for date", dateStr, ":", trainStatus);
      
      return {
        isOperational: trainStatus.isOperational,
        reason: trainStatus.reason
      };
    } catch (error) {
      console.error(`Error checking operational status for ${dateStr}:`, error);
      
      // For demonstration: Add some sample operational statuses when API fails
      const dayOfMonth = new Date(dateStr).getDate();
      
      // Demo: Show train not operational on certain dates
      if (dayOfMonth === 15) {
        return { isOperational: false, reason: 'Scheduled maintenance' };
      } else if (dayOfMonth === 22) {
        return { isOperational: false, reason: 'Track repair work' };
      } else if (dayOfMonth === 30) {
        return { isOperational: false, reason: 'Weather conditions' };
      }
      
      // Default to operational if API fails
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
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      // ✅ Fix: Create date string directly instead of using Date constructor
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
    // ✅ Add debugging
    console.log('🐛 Debug Date Click:');
    console.log('  - Clicked dateStr:', dateStr);
    console.log('  - Availability:', availability);
    
    // Check if date is within 90-day booking window
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const clickedDate = new Date(dateStr);
    clickedDate.setHours(0, 0, 0, 0);
    const maxBookingDate = new Date(today);
    maxBookingDate.setDate(maxBookingDate.getDate() + 90);
    maxBookingDate.setHours(0, 0, 0, 0);
    
    console.log(`handleDateClick: Clicked date: ${dateStr}`);
    console.log(`handleDateClick: Today: ${today.toISOString().split('T')[0]}`);
    console.log(`handleDateClick: Max booking: ${maxBookingDate.toISOString().split('T')[0]}`);
    
    if (clickedDate.getTime() < today.getTime()) {
      alert("❌ Cannot book past dates");
      return;
    }
    
    if (clickedDate.getTime() > maxBookingDate.getTime()) {
      alert(`❌ Booking not available beyond 90 days from today (Max date: ${maxBookingDate.toISOString().split('T')[0]})`);
      return;
    }
    
    // ✅ Only check operational status when date is clicked
    if (availability.status === 'available' || availability.status === 'full') {
      // Show loading state while checking operational status
      setLoading(true);
      
      try {
        const operationalStatus = await checkTrainOperationalStatus(dateStr);
        
        if (!operationalStatus.isOperational) {
          alert(`🚫 Train not operational on ${dateStr}\nReason: ${operationalStatus.reason || 'Service unavailable'}`);
          
          // Update the availability to reflect operational status
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
        
        // If train is operational and seats are available, proceed with selection
        if (availability.status === 'available') {
          handleSelectedDate(dateStr);
        } else if (availability.status === 'full') {
          alert("❌ No seats available for this date");
        }
        
      } catch (error) {
        console.error('Error checking operational status:', error);
        alert('❌ Unable to verify train operational status. Please try again.');
      } finally {
        setLoading(false);
      }
    } else if (availability.status === 'train-not-operational') {
      alert(`🚫 Train not operational on ${dateStr}\nReason: ${availability.operationalReason || 'Service unavailable'}`);
    } else {
      alert("❌ This date is not available for booking");
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    // Check if navigation is allowed before proceeding
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

  // Check if navigation is allowed
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
    
    const canNavigate = firstDayOfNextMonth.getTime() <= maxDate.getTime();
    console.log(`canNavigateNext: First day of next month: ${firstDayOfNextMonth.toISOString().split('T')[0]}, Max date: ${maxDate.toISOString().split('T')[0]}, Can navigate: ${canNavigate}`);
    
    return canNavigate;
  };

  const days = getDaysInMonth();
  
  // ✅ Create today's date string in the same format
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  // Debug: Log the 90-day limit for testing
  const maxBookingDate = new Date();
  maxBookingDate.setDate(maxBookingDate.getDate() + 90);
  console.log(`Calendar: Today is ${todayStr}, Max booking date is ${maxBookingDate.toISOString().split('T')[0]}`);

  return (
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

        {/* ✅ Selected Date Confirmation Section */}
        {internalSelectedDate && (
          <SelectedDateInfo>
            <h4>✅ Selected Date</h4>
            <p>{new Date(internalSelectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long', 
              day: 'numeric'
            })}</p>
            <ConfirmButton onClick={() => {
              alert(`Proceeding with booking for ${internalSelectedDate}`);
              onClose(); // Close calendar after confirmation
            }}>
              🎫 Confirm & Proceed
            </ConfirmButton>
            <ClearButton onClick={() => setInternalSelectedDate('')}>
              ❌ Clear Selection
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
              isToday={day?.date === todayStr}  // ✅ Fix: Use consistent date format
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
          <span>📅 Booking available up to 90 days in advance only</span>
          <br />
          <span>🚫 Train operational status checked when you click a date</span>
          <br />
          <small>Click on any green date to check availability and operational status</small>
        </BookingPolicy>

        {loading && <LoadingOverlay>Loading...</LoadingOverlay>}
      </CalendarContainer>
    </CalendarOverlay>
  );
};

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

export default Calendar;