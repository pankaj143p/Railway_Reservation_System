package com.microservices.service.implementation;

import com.microservices.domain.TrainStatus;
import com.microservices.exception.TrainException;
import com.microservices.model.TrainDetails;
import com.microservices.repository.TrainRepository;
import com.microservices.service.TrainService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TrainServiceImplementation implements TrainService {

    private static final Logger logger = LoggerFactory.getLogger(TrainServiceImplementation.class);
    private final TrainRepository trainRepository;

    // Add a new train
    @Override
    public TrainDetails addTrain(TrainDetails req) {
        TrainDetails train = new TrainDetails();
        train.setTrainName(req.getTrainName());
        train.setTotalSeats(req.getTotalSeats());
        train.setDestination(req.getDestination());
        train.setSource(req.getSource());
        train.setRoutes(req.getRoutes());
        train.setInactiveDates(req.getInactiveDates());
        train.setArrivalTime(req.getArrivalTime());
        train.setDepartureTime(req.getDepartureTime());
        train.setStatus(TrainStatus.ON_TIME);
        train.setAmount(req.getAmount());
        train.setDate(req.getDate());

        // Set new fields with defaults
        train.setIsActive(req.getIsActive() != null ? req.getIsActive() : true);
        train.setOperationalStatus(req.getOperationalStatus() != null ? req.getOperationalStatus() : "OPERATIONAL");
        train.setMaintenanceNotes(req.getMaintenanceNotes());
        logger.info("Adding new train: {}", req.getTrainName());
        return trainRepository.save(train);
    }

    // Get all trains
    @Override
    public List<TrainDetails> getAllTrains() {
        logger.info("Fetching all trains");
        return trainRepository.findAll();
    }

    // Search trains by keyword
    @Override
    public List<TrainDetails> searchTrains(String keyword) {
        logger.info("Searching trains with keyword: {}", keyword);
        return trainRepository.findBytrainNameStartingWithIgnoreCase(keyword);
    }

    // Update train details
    @Override
    public TrainDetails updateTrain(Long id, TrainDetails req) throws TrainException {
        Optional<TrainDetails> opt = trainRepository.findById(id);
        if(opt.isEmpty()){
            logger.warn("Train not found for update: {}", id);
            throw new TrainException("Train not exist with : "+id);
        }
        TrainDetails exTrain = opt.get();
        exTrain.setTrainName(req.getTrainName());
        exTrain.setTotalSeats(req.getTotalSeats());
        exTrain.setDestination(req.getDestination());
        exTrain.setSource(req.getSource());
        exTrain.setRoutes(req.getRoutes());
        exTrain.setArrivalTime(req.getArrivalTime());
        exTrain.setDepartureTime(req.getDepartureTime());
        exTrain.setStatus(TrainStatus.ON_TIME);
        exTrain.setAmount(req.getAmount());
        exTrain.setDate(req.getDate());
        exTrain.setInactiveDates(req.getInactiveDates());
        // Update new fields
        exTrain.setIsActive(req.getIsActive() != null ? req.getIsActive() : true);
        exTrain.setOperationalStatus(req.getOperationalStatus() != null ? req.getOperationalStatus() : "OPERATIONAL");
        exTrain.setMaintenanceNotes(req.getMaintenanceNotes());
        logger.info("Updated train: {}", id);
        return trainRepository.save(exTrain);
    }

    // Delete train by ID
    @Override
    public void deleteTrain(Long id) throws TrainException {
        Optional<TrainDetails> otp = trainRepository.findById(id);
        if(otp.isEmpty()){
            logger.warn("Train not found for delete: {}", id);
            throw new TrainException("Train not found with id : "+id);
        }
        trainRepository.deleteById(id);
        logger.info("Deleted train: {}", id);
    }

    // Get train by ID
    @Override
    public TrainDetails getTrainById(Long id) throws TrainException {
        Optional<TrainDetails> otp = trainRepository.findById(id);
        if(otp.isPresent()){
            logger.info("Fetched train by id: {}", id);
            return otp.get();
        }
        logger.warn("Train not found: {}", id);
        throw new TrainException("Train not found with id : "+id);
    }

    // Mark train delayed (not implemented)
    @Override
    public TrainDetails markTrainDelayed(Long id) { return null; }

    // Cancel train (not implemented)
    @Override
    public TrainDetails cancelTrain(Long id) { return null; }

    // Get train status (not implemented)
    @Override
    public String getTrainStatus(Long id) { return ""; }

    // Get today's trains
    @Override
    public List<TrainDetails> getTodayTrains() {
        logger.info("Fetching today's trains");
        return trainRepository.findBydepartureTime(LocalDate.now());
    }

    // Get trains by date
    @Override
    public List<TrainDetails> getTrainsByDate(LocalDate date) {
        logger.info("Fetching trains by date: {}", date);
        return trainRepository.findBydepartureTime(date);
    }

    // Get trains by source and destination
    @Override
    public List<TrainDetails> getTrainsBySourceAndDestination(String source, String destination) {
        logger.info("Fetching trains from {} to {}", source, destination);
        return trainRepository.findBySourceAndDestination(source, destination);
    }

    // Decrease seats for a train
    @Override
    public String decreaseSeats(Long id, int count) {
        Optional<TrainDetails> optionalTrain = trainRepository.findById(id);
        if (optionalTrain.isEmpty()) {
            logger.warn("Train not found for seat decrease: {}", id);
            throw new RuntimeException("Train not found");
        }
        TrainDetails train = optionalTrain.get();
        if (train.getTotalSeats() < count) {
            logger.warn("Not enough seats for train {}: requested {}, available {}", id, count, train.getTotalSeats());
            throw new RuntimeException("Not enough available seats");
        }
        train.setTotalSeats(train.getTotalSeats() - count);
        trainRepository.save(train);
        logger.info("Decreased seats for train {}: now {}", id, train.getTotalSeats());
        return "Seats updated successfully";
    }

    // Increase seats for a train
    @Override
    public String increaseSeats(Long id, int count) {
        Optional<TrainDetails> optionalTrain = trainRepository.findById(id);
        if (optionalTrain.isEmpty()) {
            logger.warn("Train not found for seat increase: {}", id);
            throw new RuntimeException("Train not found");
        }
        TrainDetails train = optionalTrain.get();
        train.setTotalSeats(train.getTotalSeats() + count);
        trainRepository.save(train);
        logger.info("Increased seats for train {}: now {}", id, train.getTotalSeats());
        return "Seats updated successfully";
    }

    @Override
    public String getOperationalStatus(Long id) throws TrainException {
        Optional<TrainDetails> otp = trainRepository.findById(id);
        if(otp.isPresent()){
            logger.info("Fetched train by id: {}", id);
            return otp.get().getOperationalStatus();
        }
        logger.warn("Train not found: {}", id);
        throw new TrainException("Train not found with id : "+id);
    }

    @Override
    public List<LocalDate> getAllInActiveDates(Long trainId) {
       return trainRepository.getALlInActiveDates(trainId);
    }
}