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

// const Calendar: React.FC<CalendarProps> = ({ trainId, trainDetails, onDateSelect, onClose }) => {
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [seatAvailability, setSeatAvailability] = useState<{ [key: string]: SeatAvailability }>({});
//   const [loading, setLoading] = useState(false);

//   const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

//   useEffect(() => {
//     fetchSeatAvailability();
//   }, [currentMonth, trainId]);

//   const fetchSeatAvailability = async () => {
//     setLoading(true);
//     try {
//       // const token = localStorage.getItem("token");
//       const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
//       const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
//       const availability: { [key: string]: SeatAvailability } = {};
      
//       // Calculate 90 days from today
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       const maxBookingDate = new Date(today);
//       maxBookingDate.setDate(maxBookingDate.getDate() + 90);
//       maxBookingDate.setHours(23, 59, 59, 999); // Set to end of day for comparison
      
//       console.log(`fetchSeatAvailability: Today is ${today.toISOString().split('T')[0]}, Max booking date is ${maxBookingDate.toISOString().split('T')[0]}`);
      
//       // Fetch availability for each day of the month
//       for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
//         const dateStr = date.toISOString().split('T')[0];
//         const currentDateForComparison = new Date(date);
//         currentDateForComparison.setHours(0, 0, 0, 0);
        
//         console.log(`Checking date: ${dateStr}, Date object: ${currentDateForComparison.toISOString()}, Beyond 90 days? ${currentDateForComparison > maxBookingDate}`);
        
//         if (currentDateForComparison < today) {
//           // Past dates are unavailable
//           availability[dateStr] = {
//             date: dateStr,
//             availableSeats: 0,
//             bookedSeats: 0,
//             totalSeats: trainDetails?.totalSeats || 0,
//             status: 'unavailable'
//           };
//           console.log(`Date ${dateStr} marked as PAST/UNAVAILABLE`);
//         } else if (currentDateForComparison > maxBookingDate) {
//           // Dates beyond 90 days are unavailable
//           availability[dateStr] = {
//             date: dateStr,
//             availableSeats: 0,
//             bookedSeats: 0,
//             totalSeats: trainDetails?.totalSeats || 0,
//             status: 'unavailable'
//           };
//           console.log(`Date ${dateStr} marked as BEYOND 90 DAYS/UNAVAILABLE`);
//         } else {
//           try {
//             const response = await axios.get(
//               `${API_URL}/tickets/availability/${trainId}?date=${dateStr}`,
//               {
//                 // headers: {
//                 // //   Authorization: `Bearer ${token}`,
//                 // },
//               }
//             );
            
//             const bookedSeats = response.data;
//             console.log("Booked seats for date", dateStr, ":", bookedSeats);
            
//             const totalSeats = trainDetails?.totalSeats || 0;
//             const availableSeats = totalSeats - bookedSeats;
            
//             availability[dateStr] = {
//               date: dateStr,
//               availableSeats,
//               bookedSeats,
//               totalSeats,
//               status: availableSeats <= 0 ? 'full' : 'available'
//             };
//           } catch (error) {
//             console.error(`Error fetching availability for ${dateStr}:`, error);
//             availability[dateStr] = {
//               date: dateStr,
//               availableSeats: trainDetails?.totalSeats || 0,
//               bookedSeats: 0,
//               totalSeats: trainDetails?.totalSeats || 0,
//               status: 'available'
//             };
//           }
//         }
//       }
      
//       setSeatAvailability(availability);
//     } catch (error) {
//       console.error('Error fetching seat availability:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getDaysInMonth = () => {
//     const year = currentMonth.getFullYear();
//     const month = currentMonth.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const daysInMonth = lastDay.getDate();
//     const startingDayOfWeek = firstDay.getDay();

//     const days = [];
    
//     // Add empty cells for days before the first day of the month
//     for (let i = 0; i < startingDayOfWeek; i++) {
//       days.push(null);
//     }
    
//     // Add days of the month
//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(year, month, day);
//       const dateStr = date.toISOString().split('T')[0];
//       days.push({
//         day,
//         date: dateStr,
//         availability: seatAvailability[dateStr]
//       });
//     }
    
//     return days;
//   };

//   const handleDateClick = (dateStr: string, availability: SeatAvailability) => {
//     // Check if date is within 90-day booking window
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const clickedDate = new Date(dateStr);
//     clickedDate.setHours(0, 0, 0, 0);
//     const maxBookingDate = new Date(today);
//     maxBookingDate.setDate(maxBookingDate.getDate() + 90);
//     maxBookingDate.setHours(0, 0, 0, 0);
    
//     console.log(`handleDateClick: Clicked date: ${dateStr}`);
//     console.log(`handleDateClick: Today: ${today.toISOString().split('T')[0]}`);
//     console.log(`handleDateClick: Max booking: ${maxBookingDate.toISOString().split('T')[0]}`);
//     console.log(`handleDateClick: Clicked date time: ${clickedDate.getTime()}, Max booking time: ${maxBookingDate.getTime()}`);
//     console.log(`handleDateClick: Is beyond 90 days? ${clickedDate.getTime() > maxBookingDate.getTime()}`);
    
//     if (clickedDate.getTime() < today.getTime()) {
//       alert("❌ Cannot book past dates");
//       return;
//     }
    
//     if (clickedDate.getTime() > maxBookingDate.getTime()) {
//       alert(`❌ Booking not available beyond 90 days from today (Max date: ${maxBookingDate.toISOString().split('T')[0]})`);
//       return;
//     }
    
//     if (availability.status === 'available') {
//       onDateSelect(dateStr);
//     } else if (availability.status === 'full') {
//       alert("❌ No seats available for this date");
//     } else {
//       alert("❌ This date is not available for booking");
//     }
//   };

//   const navigateMonth = (direction: 'prev' | 'next') => {
//     // Check if navigation is allowed before proceeding
//     if (direction === 'prev' && !canNavigatePrev()) return;
//     if (direction === 'next' && !canNavigateNext()) return;
    
//     const newMonth = new Date(currentMonth);
    
//     if (direction === 'prev') {
//       newMonth.setMonth(newMonth.getMonth() - 1);
//     } else {
//       newMonth.setMonth(newMonth.getMonth() + 1);
//     }
    
//     setCurrentMonth(newMonth);
//   };

//   const formatMonthYear = () => {
//     return currentMonth.toLocaleDateString('en-US', { 
//       month: 'long', 
//       year: 'numeric' 
//     });
//   };

//   // Check if navigation is allowed
//   const canNavigatePrev = () => {
//     const today = new Date();
//     const prevMonth = new Date(currentMonth);
//     prevMonth.setMonth(prevMonth.getMonth() - 1);
    
//     return !(prevMonth.getFullYear() < today.getFullYear() || 
//             (prevMonth.getFullYear() === today.getFullYear() && prevMonth.getMonth() < today.getMonth()));
//   };

//   const canNavigateNext = () => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const maxDate = new Date(today);
//     maxDate.setDate(maxDate.getDate() + 90);
//     maxDate.setHours(0, 0, 0, 0);
    
//     const nextMonth = new Date(currentMonth);
//     nextMonth.setMonth(nextMonth.getMonth() + 1);
//     const firstDayOfNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
//     firstDayOfNextMonth.setHours(0, 0, 0, 0);
    
//     const canNavigate = firstDayOfNextMonth.getTime() <= maxDate.getTime();
//     console.log(`canNavigateNext: First day of next month: ${firstDayOfNextMonth.toISOString().split('T')[0]}, Max date: ${maxDate.toISOString().split('T')[0]}, Can navigate: ${canNavigate}`);
    
//     return canNavigate;
//   };

//   const days = getDaysInMonth();
//   const today = new Date().toISOString().split('T')[0];
  
//   // Debug: Log the 90-day limit for testing
//   const maxBookingDate = new Date();
//   maxBookingDate.setDate(maxBookingDate.getDate() + 90);
//   console.log(`Calendar: Today is ${today}, Max booking date is ${maxBookingDate.toISOString().split('T')[0]}`);

//   return (
//     <CalendarOverlay>
//       <CalendarContainer>
//         <CalendarHeader>
//           <h3>Select Travel Date</h3>
//           <CloseButton onClick={onClose}>×</CloseButton>
//         </CalendarHeader>
        
//         <TrainInfo>
//           <h4>{trainDetails?.trainName}</h4>
//           <p>{trainDetails?.source} → {trainDetails?.destination}</p>
//           <p>Total Seats: {trainDetails?.totalSeats}</p>
//         </TrainInfo>

//         <CalendarNavigation>
//           <NavButton 
//             onClick={() => navigateMonth('prev')}
//             disabled={!canNavigatePrev()}
//           >
//             ‹
//           </NavButton>
//           <MonthYear>{formatMonthYear()}</MonthYear>
//           <NavButton 
//             onClick={() => navigateMonth('next')}
//             disabled={!canNavigateNext()}
//           >
//             ›
//           </NavButton>
//         </CalendarNavigation>

//         <DaysHeader>
//           {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//             <DayHeaderCell key={day}>{day}</DayHeaderCell>
//           ))}
//         </DaysHeader>

//         <CalendarGrid>
//           {days.map((day, index) => (
//             <DayCell 
//               key={index}
//               isEmpty={!day}
//               status={day?.availability?.status}
//               isToday={day?.date === today}
//               onClick={() => day?.availability && handleDateClick(day.date, day.availability)}
//             >
//               {day && (
//                 <>
//                   <DayNumber>{day.day}</DayNumber>
//                   {day.availability && (
//                     <SeatInfo>
//                       <SeatCount>{day.availability.availableSeats}</SeatCount>
//                     </SeatInfo>
//                   )}
//                 </>
//               )}
//             </DayCell>
//           ))}
//         </CalendarGrid>

//         <Legend>
//           <LegendItem>
//             <LegendColor status="available" />
//             <span>Available</span>
//           </LegendItem>
//           <LegendItem>
//             <LegendColor status="full" />
//             <span>Full</span>
//           </LegendItem>
//           <LegendItem>
//             <LegendColor status="unavailable" />
//             <span>Past/Beyond 90 days</span>
//           </LegendItem>
//         </Legend>

//         <BookingPolicy>
//           <span>📅 Booking available up to 90 days in advance only</span>
//           <br />
//           <small>Dates beyond this limit are automatically blocked</small>
//         </BookingPolicy>

//         {loading && <LoadingOverlay>Loading availability...</LoadingOverlay>}
//       </CalendarContainer>
//     </CalendarOverlay>
//   );
// };

// const CalendarOverlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background: rgba(0, 0, 0, 0.7);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 10000;
// `;

// const CalendarContainer = styled.div`
//   background: white;
//   border-radius: 16px;
//   padding: 24px;
//   width: 400px;
//   max-width: 90vw;
//   max-height: 90vh;
//   overflow-y: auto;
//   box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
//   position: relative;
// `;

// const CalendarHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 16px;
  
//   h3 {
//     margin: 0;
//     color: #333;
//     font-size: 1.4rem;
//   }
// `;

// const CloseButton = styled.button`
//   background: none;
//   border: none;
//   font-size: 24px;
//   cursor: pointer;
//   color: #666;
//   padding: 4px;
//   border-radius: 50%;
  
//   &:hover {
//     background: #f0f0f0;
//   }
// `;

// const TrainInfo = styled.div`
//   background: #f8f9fa;
//   padding: 12px;
//   border-radius: 8px;
//   margin-bottom: 16px;
  
//   h4 {
//     margin: 0 0 8px 0;
//     color: #2563eb;
//     font-size: 1.1rem;
//   }
  
//   p {
//     margin: 4px 0;
//     color: #666;
//     font-size: 0.9rem;
//   }
// `;

// const CalendarNavigation = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 16px;
// `;

// const NavButton = styled.button<{ disabled?: boolean }>`
//   background: ${props => props.disabled ? '#9ca3af' : '#2563eb'};
//   color: white;
//   border: none;
//   border-radius: 50%;
//   width: 32px;
//   height: 32px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
//   font-size: 18px;
//   opacity: ${props => props.disabled ? 0.6 : 1};
  
//   &:hover {
//     background: ${props => props.disabled ? '#9ca3af' : '#1d4ed8'};
//   }
// `;

// const MonthYear = styled.h4`
//   margin: 0;
//   color: #333;
//   font-size: 1.2rem;
// `;

// const DaysHeader = styled.div`
//   display: grid;
//   grid-template-columns: repeat(7, 1fr);
//   gap: 2px;
//   margin-bottom: 8px;
// `;

// const DayHeaderCell = styled.div`
//   text-align: center;
//   font-weight: 600;
//   color: #666;
//   font-size: 0.8rem;
//   padding: 8px 4px;
// `;

// const CalendarGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(7, 1fr);
//   gap: 2px;
//   margin-bottom: 16px;
// `;

// interface DayCellProps {
//   isEmpty?: boolean;
//   status?: 'available' | 'full' | 'unavailable';
//   isToday?: boolean;
// }

// const DayCell = styled.div<DayCellProps>`
//   aspect-ratio: 1;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   border-radius: 8px;
//   cursor: ${props => props.status === 'available' ? 'pointer' : 'default'};
//   font-size: 0.85rem;
//   position: relative;
//   min-height: 45px;
  
//   ${props => props.isEmpty && `
//     visibility: hidden;
//   `}
  
//   ${props => props.status === 'available' && `
//     background: #dcfce7;
//     color: #166534;
//     border: 2px solid #16a34a;
    
//     &:hover {
//       background: #bbf7d0;
//       transform: scale(1.05);
//     }
//   `}
  
//   ${props => props.status === 'full' && `
//     background: #fee2e2;
//     color: #991b1b;
//     border: 2px solid #dc2626;
//   `}
  
//   ${props => props.status === 'unavailable' && `
//     background: #f3f4f6;
//     color: #9ca3af;
//     border: 2px solid #d1d5db;
//   `}
  
//   ${props => props.isToday && `
//     box-shadow: 0 0 0 2px #fbbf24;
//   `}
// `;

// const DayNumber = styled.div`
//   font-weight: 600;
//   font-size: 0.9rem;
// `;

// const SeatInfo = styled.div`
//   font-size: 0.7rem;
//   margin-top: 2px;
// `;

// const SeatCount = styled.div`
//   font-weight: 500;
// `;

// const Legend = styled.div`
//   display: flex;
//   justify-content: space-around;
//   margin-top: 16px;
// `;

// const LegendItem = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 6px;
//   font-size: 0.8rem;
//   color: #666;
// `;

// const LegendColor = styled.div<{ status: string }>`
//   width: 12px;
//   height: 12px;
//   border-radius: 50%;
  
//   ${props => props.status === 'available' && `
//     background: #16a34a;
//   `}
  
//   ${props => props.status === 'full' && `
//     background: #dc2626;
//   `}
  
//   ${props => props.status === 'unavailable' && `
//     background: #9ca3af;
//   `}
// `;

// const LoadingOverlay = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background: rgba(255, 255, 255, 0.8);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   border-radius: 16px;
//   font-weight: 500;
//   color: #2563eb;
// `;

// const BookingPolicy = styled.div`
//   text-align: center;
//   margin-top: 12px;
//   padding: 8px;
//   background: #f0f9ff;
//   border-radius: 6px;
//   font-size: 0.8rem;
//   color: #0369a1;
//   border: 1px solid #e0f2fe;
// `;

// export default Calendar;
