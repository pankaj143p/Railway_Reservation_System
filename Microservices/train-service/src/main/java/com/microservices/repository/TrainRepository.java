package com.microservices.repository;

import com.microservices.model.TrainDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TrainRepository extends JpaRepository<TrainDetails, Long> {
    List<TrainDetails> findBytrainNameStartingWithIgnoreCase(String keyword);
    List<TrainDetails> findBydepartureTime(LocalDate date);
    List<TrainDetails> findBySourceAndDestination(String source, String destination);

}
