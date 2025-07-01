// import React, { useState, useEffect } from 'react';
// import { Train, TrainSchedule } from '../../interfaces/Train';
// import { getTrainSchedule, getAvailableDates } from '../../services/trainService';
// import { checkSeatAvailability } from '../../services/ticketService';

// interface DateSeatSelectorProps {
//   train: Train;
//   onDateSelect: (date: string, availableSeats: number) => void;
//   onSeatsSelect: (seats: number) => void;
//   maxPassengers?: number;
// }

// const DateSeatSelector: React.FC<DateSeatSelectorProps> = ({
//   train,
//   onDateSelect,
//   onSeatsSelect,
//   maxPassengers = 6
// }) => {
//   const [selectedDate, setSelectedDate] = useState<string>('');
//   const [selectedSeats, setSelectedSeats] = useState<number>(1);
//   const [availableDates, setAvailableDates] = useState<string[]>([]);
//   const [schedules, setSchedules] = useState<TrainSchedule[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [availability, setAvailability] = useState<{ available: boolean; availableSeats: number } | null>(null);

//   useEffect(() => {
//     // Generate available dates for the next 3 months
//     const dates = getAvailableDates(train, 3);
//     setAvailableDates(dates.slice(0, 90)); // Limit to 90 days
//   }, [train]);

//   useEffect(() => {
//     if (selectedDate) {
//       checkAvailability();
//     }
//   }, [selectedDate, selectedSeats]);

//   const checkAvailability = async () => {
//     if (!selectedDate) return;

//     setLoading(true);
//     try {
//       const result = await checkSeatAvailability(train.trainId, selectedDate, selectedSeats);
//       setAvailability(result);
      
//       if (result.available) {
//         onDateSelect(selectedDate, result.availableSeats);
//         onSeatsSelect(selectedSeats);
//       }
//     } catch (error) {
//       console.error('Error checking availability:', error);
//       setAvailability({ available: false, availableSeats: 0 });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDateChange = (date: string) => {
//     setSelectedDate(date);
//   };

//   const handleSeatsChange = (seats: number) => {
//     setSelectedSeats(seats);
//   };

//   const formatDate = (dateStr: string) => {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString('en-US', {
//       weekday: 'short',
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const getDateStatus = (date: string) => {
//     if (!train.availableSeats) return 'unknown';
//     const available = train.availableSeats[date] || 0;
//     if (available === 0) return 'full';
//     if (available < 10) return 'limited';
//     return 'available';
//   };

//   const renderCalendar = () => {
//     const today = new Date();
//     const currentMonth = today.getMonth();
//     const currentYear = today.getFullYear();
    
//     const months = [];
//     for (let i = 0; i < 3; i++) {
//       const monthDate = new Date(currentYear, currentMonth + i, 1);
//       months.push(monthDate);
//     }

//     return (
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         {months.map((month, monthIndex) => (
//           <div key={monthIndex} className="border rounded-lg p-4">
//             <h4 className="text-lg font-semibold mb-3 text-center">
//               {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//             </h4>
//             <div className="grid grid-cols-7 gap-1 text-sm">
//               {/* Day headers */}
//               {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//                 <div key={day} className="text-center font-medium text-gray-500 p-2">
//                   {day}
//                 </div>
//               ))}
              
//               {/* Calendar days */}
//               {Array.from({ length: 42 }, (_, index) => {
//                 const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
//                 const dayOfWeek = firstDay.getDay();
//                 const dayNumber = index - dayOfWeek + 1;
//                 const date = new Date(month.getFullYear(), month.getMonth(), dayNumber);
//                 const dateStr = date.toISOString().split('T')[0];
                
//                 const isCurrentMonth = dayNumber > 0 && dayNumber <= new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
//                 const isAvailable = isCurrentMonth && availableDates.includes(dateStr);
//                 const isPast = date < today;
//                 const status = getDateStatus(dateStr);
                
//                 if (!isCurrentMonth) {
//                   return <div key={index} className="p-2"></div>;
//                 }

//                 return (
//                   <button
//                     key={index}
//                     onClick={() => !isPast && isAvailable && handleDateChange(dateStr)}
//                     disabled={isPast || !isAvailable}
//                     className={`
//                       p-2 text-center rounded transition-colors
//                       ${selectedDate === dateStr 
//                         ? 'bg-blue-500 text-white' 
//                         : isPast || !isAvailable
//                         ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                         : status === 'full'
//                         ? 'bg-red-100 text-red-600 cursor-not-allowed'
//                         : status === 'limited'
//                         ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
//                         : 'bg-green-100 text-green-700 hover:bg-green-200'
//                       }
//                     `}
//                   >
//                     {dayNumber}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-xl font-semibold mb-4">Select Travel Date</h3>
//         {renderCalendar()}
        
//         {/* Legend */}
//         <div className="flex flex-wrap gap-4 text-sm">
//           <div className="flex items-center gap-2">
//             <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
//             <span>Available</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
//             <span>Limited seats</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
//             <span>Full</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
//             <span>Not available</span>
//           </div>
//         </div>
//       </div>

//       {selectedDate && (
//         <div>
//           <h3 className="text-xl font-semibold mb-4">Select Number of Passengers</h3>
//           <div className="flex flex-wrap gap-2">
//             {Array.from({ length: maxPassengers }, (_, i) => i + 1).map(seats => (
//               <button
//                 key={seats}
//                 onClick={() => handleSeatsChange(seats)}
//                 className={`
//                   px-4 py-2 rounded border transition-colors
//                   ${selectedSeats === seats
//                     ? 'bg-blue-500 text-white border-blue-500'
//                     : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
//                   }
//                 `}
//               >
//                 {seats} {seats === 1 ? 'Passenger' : 'Passengers'}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {selectedDate && availability && (
//         <div className="p-4 rounded-lg border">
//           <h4 className="font-semibold mb-2">Booking Summary</h4>
//           <div className="space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span>Travel Date:</span>
//               <span className="font-medium">{formatDate(selectedDate)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Passengers:</span>
//               <span className="font-medium">{selectedSeats}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Available Seats:</span>
//               <span className={`font-medium ${availability.available ? 'text-green-600' : 'text-red-600'}`}>
//                 {availability.availableSeats}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span>Status:</span>
//               <span className={`font-medium ${availability.available ? 'text-green-600' : 'text-red-600'}`}>
//                 {availability.available ? 'Available' : 'Not Available'}
//               </span>
//             </div>
//             {!availability.available && (
//               <div className="text-red-600 text-xs mt-2">
//                 Insufficient seats available for selected date and passenger count.
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {loading && (
//         <div className="text-center py-4">
//           <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
//           <span className="ml-2">Checking availability...</span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DateSeatSelector;
