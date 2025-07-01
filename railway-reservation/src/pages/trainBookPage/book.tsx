// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import TicketConfirm from '../../components/booking/bookingConform';
// import { Train } from '../../interfaces/Train';
// import { fetchTrainList } from '../../services/trainService';

// const Book = () => {
//   const { trainId } = useParams<{ trainId: string }>();
//   const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const loadTrainDetails = async () => {
//       if (trainId) {
//         try {
//           const trains = await fetchTrainList();
//           const train = trains?.find((t: Train) => t.trainId === parseInt(trainId));
//           if (train) {
//             setSelectedTrain(train);
//           }
//         } catch (error) {
//           console.error('Error loading train details:', error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     loadTrainDetails();
//   }, [trainId]);

//   const handleSubmit = (formData: { fullName: string; seatCount: string; age: string; email: string; }) => {
//     const bookingData = {
//       ...formData,
//       trainId: parseInt(trainId!)
//     };
//     console.log('Booking Data:', bookingData);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (!selectedTrain) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-700">Train not found</h2>
//           <p className="text-gray-500 mt-2">The requested train could not be loaded.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className='min-h-screen bg-gray-50 py-20'>
//       <div className='container mx-auto px-4 py-8'>
//         {/* Train Details Header */}
//         <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
//           <h1 className='text-3xl font-bold text-gray-800 mb-4'>Book Your Journey</h1>
//           <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//             <div>
//               <h2 className='text-xl font-semibold text-blue-600'>{selectedTrain.trainName}</h2>
//               <p className='text-gray-600'>{selectedTrain.source} → {selectedTrain.destination}</p>
//               <p className='text-gray-600'>Departure: {selectedTrain.departureTime} | Arrival: {selectedTrain.arrivalTime}</p>
//             </div>
//             <div className='text-right'>
//               <p className='text-2xl font-bold text-green-600'>₹{selectedTrain.amount}</p>
//               <p className='text-gray-500'>per person</p>
//             </div>
//           </div>
//         </div>

//         {/* Booking Form */}
//         <div className='bg-white rounded-lg shadow-md p-6'>
//           <TicketConfirm onSubmit={handleSubmit} />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Book;


import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TicketConfirm from '../../components/booking/bookingConform';
import { Train } from '../../interfaces/Train';
import { fetchTrainList } from '../../services/trainService';

const Book = () => {
  const { trainId } = useParams<{ trainId: string }>();
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTrainDetails = async () => {
      if (trainId) {
        try {
          const trains = await fetchTrainList();
          const train = trains?.find((t: Train) => t.trainId === parseInt(trainId));
          if (train) {
            setSelectedTrain(train);
          }
        } catch (error) {
          console.error('Error loading train details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadTrainDetails();
  }, [trainId]);

  const handleSubmit = (formData: { fullName: string; seatCount: string; age: string; email: string; }) => {
    const bookingData = {
      ...formData,
      trainId: parseInt(trainId!)
    };
    console.log('Booking Data:', bookingData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex justify-center items-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin" style={{animationDelay: '0.15s'}}></div>
        </div>
      </div>
    );
  }

  if (!selectedTrain) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex justify-center items-center">
        <div className="backdrop-blur-md bg-white/80 rounded-2xl border border-blue-200 p-8 text-center shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Train not found</h2>
          <p className="text-gray-600">The requested train could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-4 sm:px-6 lg:px-8'>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className='container mx-auto max-w-6xl relative z-10 pt-16 pb-8'>
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 tracking-tight'>
            Book Your 
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Journey</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Experience seamless travel with our premium booking service
          </p>
        </div>

        {/* Train Details Header */}
        <div className='backdrop-blur-md bg-white/90 rounded-3xl border border-blue-200 p-6 sm:p-8 mb-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:bg-white/95'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-center'>
            {/* Train Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className='text-2xl sm:text-3xl font-bold text-gray-800'>{selectedTrain.trainName}</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="backdrop-blur-sm bg-blue-50/80 rounded-2xl p-4 border border-blue-200">
                  <h3 className="text-gray-600 text-sm font-medium mb-2">Route</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-800 font-semibold">{selectedTrain.source}</span>
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <span className="text-gray-800 font-semibold">{selectedTrain.destination}</span>
                  </div>
                </div>
                
                <div className="backdrop-blur-sm bg-blue-50/80 rounded-2xl p-4 border border-blue-200">
                  <h3 className="text-gray-600 text-sm font-medium mb-2">Timing</h3>
                  <div className="space-y-1">
                    <p className="text-gray-800 text-sm">Departure: <span className="font-semibold">{selectedTrain.departureTime}</span></p>
                    <p className="text-gray-800 text-sm">Arrival: <span className="font-semibold">{selectedTrain.arrivalTime}</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className='text-center lg:text-right'>
              <div className="backdrop-blur-sm bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-2xl p-6 border border-blue-300">
                <p className="text-blue-600 text-sm font-medium mb-2">Price per person</p>
                <p className='text-4xl sm:text-5xl font-bold text-gray-800 mb-2'>₹{selectedTrain.amount}</p>
                <div className="flex items-center justify-center lg:justify-end space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-600 text-sm font-medium">Best Price Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className='backdrop-blur-md bg-white/90 rounded-3xl border border-blue-200 p-6 sm:p-8 shadow-2xl hover:shadow-3xl transition-all duration-300'>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Passenger Details</h3>
          </div>
          <TicketConfirm onSubmit={handleSubmit} />
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {[
            { icon: "🔒", title: "Secure Payment", desc: "256-bit SSL encryption" },
            { icon: "⚡", title: "Instant Booking", desc: "Confirmed in seconds" },
            { icon: "📞", title: "24/7 Support", desc: "Always here to help" }
          ].map((item, index) => (
            <div key={index} className="backdrop-blur-sm bg-white/80 rounded-2xl p-4 border border-blue-200 text-center hover:bg-white/90 transition-all duration-300">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h4 className="text-gray-800 font-semibold mb-1">{item.title}</h4>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Book;