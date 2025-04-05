package com.microservices.service;

import com.microservices.model.TrainDetails;

import java.util.List;

public interface TrainService {
    String addTrain(TrainDetails train);
    List<TrainDetails> getAllTrains();
}