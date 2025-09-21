package com.microservices.repository;

import com.microservices.model.TrainDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TrainRepository extends JpaRepository<TrainDetails, Long> {
    List<TrainDetails> findBytrainNameStartingWithIgnoreCase(String keyword);
    List<TrainDetails> findBydepartureTime(LocalDate date);
    List<TrainDetails> findBySourceAndDestination(String source, String destination);
    @Query("SELECT i FROM TrainDetails t JOIN t.inactiveDates i WHERE t.trainId = :trainId")
    List<LocalDate> getALlInActiveDates(@Param("trainId") Long trainId);

}
