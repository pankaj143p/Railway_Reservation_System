package com.microservices.repository;

import com.microservices.model.TicketBooking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<TicketBooking, Long> {
    List<TicketBooking> findByTrainId(Long trainId);
    Optional<TicketBooking> findByOrderId(String orderId);
    List<TicketBooking> findByUserEmail(String userEmail);
}
