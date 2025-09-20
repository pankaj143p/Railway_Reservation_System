package com.microservices.repository;

import com.microservices.model.TicketBooking;
import com.microservices.domain.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<TicketBooking, Long> {
    List<TicketBooking> findByTrainId(Long trainId);
    Optional<TicketBooking> findByOrderId(String orderId);
    List<TicketBooking> findByUserEmail(String userEmail);
    
    // Legacy method - kept for backward compatibility
    @Query("SELECT COALESCE(SUM(t.noOfSeats), 0) FROM TicketBooking t WHERE t.trainId = :trainId AND DATE(t.bookingDate) = :date AND t.status = 'CONFIRMED'")
    Integer getBookedSeatsCountByTrainAndDate(@Param("trainId") Long trainId, @Param("date") LocalDate date);
    
    // New methods for seat class based queries
    @Query("SELECT COALESCE(SUM(t.noOfSeats), 0) FROM TicketBooking t WHERE t.trainId = :trainId AND DATE(t.bookingDate) = :date AND t.seatClass = :seatClass AND t.status = 'CONFIRMED'")
    Integer getBookedSeatsCountByTrainDateAndClass(@Param("trainId") Long trainId, @Param("date") LocalDate date, @Param("seatClass") String seatClass);
    
    // Get bookings by train, date and class
    List<TicketBooking> findByTrainIdAndBookingDateAndSeatClassAndStatus(Long trainId, LocalDate bookingDate, String seatClass, TicketStatus status);
    
    // Get all bookings for a train and date
    List<TicketBooking> findByTrainIdAndBookingDateAndStatus(Long trainId, LocalDate bookingDate, TicketStatus status);
    
    // Get seat class wise booking summary
    @Query("SELECT t.seatClass, COALESCE(SUM(t.noOfSeats), 0) FROM TicketBooking t WHERE t.trainId = :trainId AND DATE(t.bookingDate) = :date AND t.status = 'CONFIRMED' GROUP BY t.seatClass")
    List<Object[]> getSeatClassWiseBookingSummary(@Param("trainId") Long trainId, @Param("date") LocalDate date);
    
    // Check if specific seat numbers are booked
    @Query("SELECT COUNT(t) > 0 FROM TicketBooking t WHERE t.trainId = :trainId AND DATE(t.bookingDate) = :date AND t.seatClass = :seatClass AND t.status = 'CONFIRMED' AND t.seatNumbers LIKE %:seatNumber%")
    Boolean isSeatNumberBooked(@Param("trainId") Long trainId, @Param("date") LocalDate date, @Param("seatClass") String seatClass, @Param("seatNumber") String seatNumber);
    
    // Get revenue by seat class
    @Query("SELECT t.seatClass, COALESCE(SUM(t.totalAmount), 0) FROM TicketBooking t WHERE t.trainId = :trainId AND DATE(t.bookingDate) = :date AND t.status = 'CONFIRMED' GROUP BY t.seatClass")
    List<Object[]> getRevenueByClass(@Param("trainId") Long trainId, @Param("date") LocalDate date);
}

