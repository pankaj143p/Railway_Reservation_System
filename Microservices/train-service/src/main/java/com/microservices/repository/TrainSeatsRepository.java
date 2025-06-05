package com.microservices.repository;

import com.microservices.model.TrainSeats;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface TrainSeatsRepository extends JpaRepository<TrainSeats, Long> {
    Optional<TrainSeats> findBytrainIdAndJourneyDate(Long trainId, LocalDate journeyDate);
}
