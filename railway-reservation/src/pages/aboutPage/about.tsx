import { useEffect } from 'react';

const About = () => {
  useEffect(() => {
    document.title = "About Us - I Rail Gateway";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About I Rail Gateway
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner for seamless railway reservations across the nation. 
            Connecting millions of passengers to their destinations with ease and reliability.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                To revolutionize railway travel by providing a comprehensive, user-friendly platform 
                that makes train reservations simple, secure, and accessible to everyone.
              </p>
              <p className="text-gray-600">
                We strive to enhance the travel experience by offering real-time information, 
                seamless booking processes, and exceptional customer service.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Key Statistics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-700">Daily Bookings:</span>
                  <span className="font-semibold text-blue-900">50,000+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Active Routes:</span>
                  <span className="font-semibold text-blue-900">2,500+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Cities Connected:</span>
                  <span className="font-semibold text-blue-900">1,200+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Customer Satisfaction:</span>
                  <span className="font-semibold text-blue-900">98.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reliability</h3>
              <p className="text-gray-600">
                Dependable service you can trust, ensuring your bookings are secure and confirmed.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Security</h3>
              <p className="text-gray-600">
                Advanced security measures to protect your personal information and payment details.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer First</h3>
              <p className="text-gray-600">
                Putting passengers first with 24/7 support and user-friendly booking experience.
              </p>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="bg-gray-900 text-white rounded-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Powered by Modern Technology</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our platform leverages cutting-edge technology to provide you with the best booking experience.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">AI</span>
              </div>
              <h4 className="font-semibold mb-2">Smart Recommendations</h4>
              <p className="text-gray-400 text-sm">AI-powered train suggestions based on your preferences</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">RT</span>
              </div>
              <h4 className="font-semibold mb-2">Real-time Updates</h4>
              <p className="text-gray-400 text-sm">Live train status and instant booking confirmations</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">MS</span>
              </div>
              <h4 className="font-semibold mb-2">Microservices</h4>
              <p className="text-gray-400 text-sm">Scalable architecture ensuring high availability</p>
            </div>
            <div className="text-center">
              <div className="bg-red-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">24/7</span>
              </div>
              <h4 className="font-semibold mb-2">Always Available</h4>
              <p className="text-gray-400 text-sm">Round-the-clock service with 99.9% uptime</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Commitment</h2>
          <div className="bg-blue-50 p-8 rounded-lg">
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              At I Rail Gateway, we are committed to making railway travel accessible, convenient, and enjoyable for everyone. 
              Our dedicated team works tirelessly to ensure that your journey begins the moment you visit our platform. 
              We believe that travel should be about the destination, not the complications of getting there.
            </p>
            <div className="mt-8">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200">
                Start Your Journey Today
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
