package com.microservices.repository;

import com.microservices.model.TrainDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainRepository extends JpaRepository<TrainDetails, Long> {

}
