package com.microservices.repository;

import com.microservices.model.TicketBooking;
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
    
    @Query("SELECT COALESCE(SUM(t.noOfSeats), 0) FROM TicketBooking t WHERE t.trainId = :trainId AND DATE(t.bookingDate) = :date AND t.status = 'CONFIRMED'")
    Integer getBookedSeatsCountByTrainAndDate(@Param("trainId") Long trainId, @Param("date") LocalDate date);
}
