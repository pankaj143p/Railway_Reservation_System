package com.microservices.repository;

import com.microservices.model.TicketBooking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<TicketBooking, Long> {
    List<TicketBooking> findByTrainId(Long trainId);
}
