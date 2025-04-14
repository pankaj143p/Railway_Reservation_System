import React from 'react';

const HomePage = () => {
  return (
   <>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Train Booking System</h1>
        <p className="text-lg mb-8">Book your tickets easily and conveniently.</p>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Get Started
        </button>
     </div>
   </>
  );
}

export default HomePage;
