
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/navbar';
import Card from '../../components/ui/card/socialcard';

// Features data for the homepage
const features = [
  {
    title: "Easy Booking",
    desc: "Book train tickets quickly and securely from anywhere.",
  },
  {
    title: "Live Train Status",
    desc: "Check real-time train schedules and running status.",
  },
  {
    title: "PNR Enquiry",
    desc: "Get instant updates on your PNR status and seat confirmation.",
  },
  {
    title: "User Dashboard",
    desc: "Manage your bookings, cancellations, and travel history.",
  },
];


// HomePage component
const HomePage = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();

  const handleQuickSearch = () => {
    setValidationError('');
    
    if (!source || !destination || !date) {
      setValidationError('Please fill all fields');
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
    
    navigate(`/search-trains?source=${source}&destination=${destination}&date=${date}`);
  };

  return (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
    {/* Header */}
    <header className="shadow bg-white">
      <Navbar />
    </header>

    {/* Main Welcome Section */}
    <main className="flex-1 flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl font-extrabold text-blue-900 mt-16 mb-4 text-center drop-shadow">
        I Rail Gateway
      </h1>
      <p className="text-lg text-gray-700 mb-10 text-center max-w-2xl">
        Welcome to I Rail Gateway, your one-stop solution for seamless train management and ticket reservations. Experience hassle-free booking, live train status, and more!
      </p>

      {/* Quick Search Section */}
      <section className="w-full max-w-4xl mb-12">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">🔍 Quick Train Search</h2>
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
                onClick={handleQuickSearch}
                className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search Trains
              </button>
            </div>
          </div>
          
          {validationError && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
              {validationError}
            </div>
          )}
          
          <div className="mt-4 text-center text-sm text-gray-600">
            📅 Booking available up to 90 days in advance
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition"
          >
            <div className="text-blue-700 text-2xl font-bold mb-2">{f.title}</div>
            <div className="text-gray-600 text-center">{f.desc}</div>
          </div>
        ))}
      </section>
    </main>

    {/* Footer with Social Media */}
    <footer className="w-full bg-white py-8 border-t flex flex-col items-center">
      <div className="mb-2 text-gray-700 font-semibold">Connect with us</div>
      <Card />
      <div className="mt-4 text-xs text-gray-500">&copy; {new Date().getFullYear()} I Rail Gateway. All rights reserved.</div>
    </footer>
  </div>
  );
};

export default HomePage;