package com.microservices.service;

import com.microservices.dto.SeatAvailabilityResponse;
import com.microservices.dto.SeatBookingRequest;
import com.microservices.dto.SeatBookingResponse;
import com.microservices.model.SeatBooking;

import java.time.LocalDate;
import java.util.List;

public interface SeatBookingService {
    
    // Book seats
    SeatBookingResponse bookSeats(SeatBookingRequest request);
    
    // Book specific seat number
    SeatBookingResponse bookSpecificSeat(Long trainId, Integer seatNumber, String seatClass, 
                                        LocalDate bookingDate, String passengerName, 
                                        String passengerEmail, String passengerPhone);
    
    // Get seat availability for a train and date
    SeatAvailabilityResponse getSeatAvailability(Long trainId, LocalDate date);
    
    // Check if specific seat is available
    Boolean isSeatAvailable(Long trainId, Integer seatNumber, String seatClass, LocalDate date);
    
    // Get next available seat in a class
    Integer getNextAvailableSeat(Long trainId, String seatClass, LocalDate date);
    
    // Get booked seats for a class
    List<Integer> getBookedSeats(Long trainId, String seatClass, LocalDate date);
    
    // Cancel booking
    void cancelBooking(Long bookingId);
    
    // Get booking details
    SeatBookingResponse getBookingDetails(Long bookingId);
    
    // Get passenger booking history
    List<SeatBookingResponse> getPassengerBookings(String email);
    
    // Get all bookings for a train and date
    List<SeatBooking> getTrainBookings(Long trainId, LocalDate date);
    
    // Validate seat number for class
    Boolean isValidSeatForClass(Long trainId, Integer seatNumber, String seatClass);
}
