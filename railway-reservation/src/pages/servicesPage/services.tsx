import { useEffect } from 'react';

const Services = () => {
  useEffect(() => {
    document.title = "Our Services - I Rail Gateway";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive railway services designed to make your travel experience smooth, 
            comfortable, and hassle-free from booking to destination.
          </p>
        </div>

        {/* Main Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Ticket Booking */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Online Ticket Booking</h3>
            <p className="text-gray-600 mb-4">
              Book train tickets instantly with our user-friendly interface. Choose from thousands of trains, 
              select your preferred class, and get instant confirmation.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Real-time seat availability</li>
              <li>• Multiple payment options</li>
              <li>• Instant e-tickets</li>
              <li>• Easy cancellation & refunds</li>
            </ul>
          </div>

          {/* Train Search */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Train Search</h3>
            <p className="text-gray-600 mb-4">
              Find the perfect train for your journey with our advanced search filters. 
              Compare prices, timings, and amenities to make the best choice.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Filter by time, price & class</li>
              <li>• Route optimization</li>
              <li>• Alternative suggestions</li>
              <li>• Fastest & cheapest options</li>
            </ul>
          </div>

          {/* Live Tracking */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Live Train Tracking</h3>
            <p className="text-gray-600 mb-4">
              Track your train in real-time and get live updates on delays, platform changes, 
              and estimated arrival times.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• GPS-based live location</li>
              <li>• Delay notifications</li>
              <li>• Platform information</li>
              <li>• Journey progress updates</li>
            </ul>
          </div>

          {/* Seat Selection */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Preferred Seat Selection</h3>
            <p className="text-gray-600 mb-4">
              Choose your preferred seats with our interactive seat map. Select window, aisle, 
              or specific berth preferences based on availability.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Interactive seat map</li>
              <li>• Window/Aisle preferences</li>
              <li>• Upper/Lower berth choice</li>
              <li>• Group booking options</li>
            </ul>
          </div>

          {/* Mobile App */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Mobile Application</h3>
            <p className="text-gray-600 mb-4">
              Book on-the-go with our mobile app. Access all features offline, 
              get push notifications, and enjoy a seamless mobile experience.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Offline ticket access</li>
              <li>• Push notifications</li>
              <li>• Quick booking shortcuts</li>
              <li>• Biometric authentication</li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Customer Support</h3>
            <p className="text-gray-600 mb-4">
              Round-the-clock customer support through multiple channels. 
              Our team is always ready to assist you with any queries or issues.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Live chat support</li>
              <li>• Phone assistance</li>
              <li>• Email support</li>
              <li>• FAQ & help center</li>
            </ul>
          </div>
        </div>

        {/* Premium Services */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Premium Services</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Unlock exclusive features and priority services with our premium membership
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-3">Priority Booking</h4>
              <p className="text-blue-100 text-sm">
                Get priority access during high-demand booking periods and tatkal tickets
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-3">Concierge Service</h4>
              <p className="text-blue-100 text-sm">
                Personal booking assistant for complex itineraries and group bookings
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-3">Exclusive Deals</h4>
              <p className="text-blue-100 text-sm">
                Access to special discounts, cashback offers, and partner benefits
              </p>
            </div>
          </div>
        </div>

        {/* Service Guarantee */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Service Guarantee</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime Guarantee</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">&lt;30s</div>
              <div className="text-gray-600">Booking Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
              <div className="text-gray-600">Secure Payments</div>
            </div>
          </div>
          <div className="mt-8">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 mr-4">
              Explore All Services
            </button>
            <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-200">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
