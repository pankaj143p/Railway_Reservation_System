import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Train } from "../../../interfaces/Train";

import Calendar from "../../common/Calender";


interface CardProps {
  train: Train;
}

const Card: React.FC<CardProps> = ({ train }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const navigate = useNavigate();

  const handleBookNowClick = () => {
    setShowCalendar(true);
  };

  const handleDateSelect = (selectedDate: string) => {
    setShowCalendar(false);
    // Navigate to booking page with selected date
    navigate(`/book/${train.trainId}?date=${selectedDate}`);
  };

  const handleCloseCalendar = () => {
    setShowCalendar(false);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-white via-blue-100 to-white rounded-xl shadow-lg p-6 flex flex-col h-full">
        <h2 className="text-xl font-bold text-blue-700 mb-2">{train.trainName}</h2>
        <div className="flex flex-col gap-1 text-gray-700 flex-1">
          <span><b>From:</b> {train.source}</span>
          <span><b>To:</b> {train.destination}</span>
          <span><b>Date:</b> {train.date}</span>
          <span><b>Departure:</b> {train.departureTime}</span>
          <span><b>Arrival:</b> {train.arrivalTime}</span>
          <span><b>Amount:</b> ₹{train.amount}</span>
          <span><b>Total Seats:</b> {train.totalSeats}</span>
          <span className={`font-bold ${train.status === "ON_TIME" ? "text-green-600" : "text-red-600"}`}>
            Status: {train.status}
          </span>
        </div>
        <button
          onClick={handleBookNowClick}
          className="mt-4 bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
        >
          Book Now
        </button>
      </div>

      {showCalendar && (
        <Calendar
          trainId={train.trainId.toString()}
          trainDetails={train}
          onDateSelect={handleDateSelect}
          onClose={handleCloseCalendar}
        />
      )}
    </>
  );
};

export default Card;