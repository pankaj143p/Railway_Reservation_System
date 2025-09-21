package com.microservices.service;

import com.microservices.dto.SeatAvailabilityDTO;
import com.microservices.dto.TrainSearchDTO;
import com.microservices.exception.TrainException;
import com.microservices.model.TrainDetails;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface TrainService {
    TrainDetails addTrain(TrainDetails train);
    List<TrainDetails> getAllTrains();
    List<TrainDetails> searchTrains(String keyword);
    TrainDetails updateTrain(Long id, TrainDetails train) throws TrainException;
    void deleteTrain(Long id) throws TrainException;
    TrainDetails getTrainById(Long id) throws TrainException;
    TrainDetails markTrainDelayed(Long id) throws TrainException;
    TrainDetails cancelTrain(Long id) throws TrainException;
    String getTrainStatus(Long id) throws TrainException;
    List<TrainDetails> getTodayTrains();
    List<TrainDetails> getTrainsByDate(LocalDate date);
    List<TrainDetails> getTrainsBySourceAndDestination(String source, String destination);
    String decreaseSeats(Long id, int cnt);
    String increaseSeats(Long id, int cnt);
    String getOperationalStatus(Long trainId) throws TrainException;
    List<LocalDate> getALlInActiveDates(Long id) throws TrainException;
    boolean toggleActiveStatus(Long trainId) throws TrainException;
    
    // New methods for IRCTC-like features
    List<TrainSearchDTO> searchTrainsWithAvailability(String source, String destination, LocalDate date);
    List<SeatAvailabilityDTO> getSeatAvailabilityByClass(Long trainId, LocalDate date);
    List<Integer> getAvailableSeats(Long trainId, String seatClass, LocalDate date);
    boolean bookSeat(Long trainId, String seatClass, Integer seatNumber, LocalDate date, String passengerName, String passengerEmail);
    
    // Admin seat management
    List<TrainDetails> getAllActiveTrains();
    Map<String, Object> getSeatClassAnalytics(Long trainId, LocalDate date);
    String bulkConfigureUnconfiguredTrains(int totalSeats, int sleeperRatio, int ac2Ratio, int ac1Ratio);
}