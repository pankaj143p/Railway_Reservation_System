package com.microservices.service;

import com.microservices.exception.TrainException;
import com.microservices.model.TrainDetails;

import java.time.LocalDate;
import java.util.List;

public interface TrainService {
    TrainDetails addTrain(TrainDetails train);
    List<TrainDetails> getAllTrains();
    List<TrainDetails> searchTrains(String keyword);
    TrainDetails updateTrain(Long id, TrainDetails train) throws TrainException;
    void deleteTrain(Long id) throws TrainException;
    TrainDetails getTrainById(Long id) throws TrainException;
    TrainDetails markTrainDelayed(Long id);
    TrainDetails cancelTrain(Long id);
    String getTrainStatus(Long id);
    List<TrainDetails> getTodayTrains();
    List<TrainDetails> getTrainsByDate(LocalDate date);
    List<TrainDetails> getTrainsBySourceAndDestination(String source, String destination);
    String decreaseSeats(Long id, int cnt);
    String increaseSeats(Long id, int cnt);
}