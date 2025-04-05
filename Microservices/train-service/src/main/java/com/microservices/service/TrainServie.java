package com.microservices.service;

import com.microservices.model.TrainDetails;

import java.util.List;

public interface TrainServie {
    String addTrain(TrainDetails train);
    String updateTrain(TrainDetails train, Long train_id);
    List<TrainDetails> getAllTrains();
}
