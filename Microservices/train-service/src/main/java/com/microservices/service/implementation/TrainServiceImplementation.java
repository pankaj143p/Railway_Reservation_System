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
        train.setArrivalTime(req.getArrivalTime());
        train.setDepartureTime(req.getDepartureTime());
        train.setStatus(req.getStatus() != null ? req.getStatus() : TrainStatus.ON_TIME);
        train.setAmount(req.getAmount());
        train.setDate(req.getDate());
        train.setInactiveDates(req.getInactiveDates());
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
        
        // Log the incoming request for debugging
        logger.info("Updating train {} with data: {}", id, req);
        
        // Only update non-null fields to allow partial updates
        if (req.getTrainName() != null && !req.getTrainName().trim().isEmpty()) {
            exTrain.setTrainName(req.getTrainName());
        }
        if (req.getTotalSeats() != 0 && req.getTotalSeats() > 0) {
            exTrain.setTotalSeats(req.getTotalSeats());
        }
        if (req.getDestination() != null && !req.getDestination().trim().isEmpty()) {
            exTrain.setDestination(req.getDestination());
        }
        if (req.getSource() != null && !req.getSource().trim().isEmpty()) {
            exTrain.setSource(req.getSource());
        }
        if (req.getRoutes() != null) {
            exTrain.setRoutes(req.getRoutes());
        }
        if (req.getArrivalTime() != null) {
            exTrain.setArrivalTime(req.getArrivalTime());
        }
        if (req.getDepartureTime() != null) {
            exTrain.setDepartureTime(req.getDepartureTime());
        }
        // IMPORTANT: Only update status if it's provided and valid
        if (req.getStatus() != null) {
            logger.info("Updating status from {} to {}", exTrain.getStatus(), req.getStatus());
            exTrain.setStatus(req.getStatus());
        }
        if (req.getAmount() != null) {
            exTrain.setAmount(req.getAmount());
        }
        if (req.getDate() != null) {
            exTrain.setDate(req.getDate());
        }
        if (req.getInactiveDates() != null) {
            exTrain.setInactiveDates(req.getInactiveDates());
        }
        // Update new fields
        if (req.getIsActive() != null) {
            exTrain.setIsActive(req.getIsActive());
        }
        if (req.getOperationalStatus() != null && !req.getOperationalStatus().trim().isEmpty()) {
            exTrain.setOperationalStatus(req.getOperationalStatus());
        }
        if (req.getMaintenanceNotes() != null) {
            exTrain.setMaintenanceNotes(req.getMaintenanceNotes());
        }
        
        logger.info("Saving updated train: {}", exTrain);
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

    // Mark train delayed
    @Override
    public TrainDetails markTrainDelayed(Long id) throws TrainException {
        Optional<TrainDetails> opt = trainRepository.findById(id);
        if(opt.isEmpty()){
            logger.warn("Train not found for delay marking: {}", id);
            throw new TrainException("Train not found with id : "+id);
        }
        TrainDetails train = opt.get();
        train.setStatus(TrainStatus.DELAYED);
        logger.info("Marked train as delayed: {}", id);
        return trainRepository.save(train);
    }

    // Cancel train
    @Override
    public TrainDetails cancelTrain(Long id) throws TrainException {
        Optional<TrainDetails> opt = trainRepository.findById(id);
        if(opt.isEmpty()){
            logger.warn("Train not found for cancellation: {}", id);
            throw new TrainException("Train not found with id : "+id);
        }
        TrainDetails train = opt.get();
        train.setStatus(TrainStatus.CANCELLED);
        logger.info("Cancelled train: {}", id);
        return trainRepository.save(train);
    }

    // Get train status
    @Override
    public String getTrainStatus(Long id) throws TrainException {
        Optional<TrainDetails> otp = trainRepository.findById(id);
        if(otp.isPresent()){
            logger.info("Fetched train status for id: {}", id);
            return otp.get().getStatus().toString();
        }
        logger.warn("Train not found: {}", id);
        throw new TrainException("Train not found with id : "+id);
    }

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
            logger.info("Fetched operational status for train id: {}", id);
            return otp.get().getOperationalStatus();
        }
        logger.warn("Train not found: {}", id);
        throw new TrainException("Train not found with id : "+id);
    }

    @Override
    public List<LocalDate> getALlInActiveDates(Long id) throws TrainException {
        Optional<TrainDetails> otp = trainRepository.findById(id);
        if(otp.isPresent()){
            logger.info("Fetched inactive dates for train id: {}", id);
            return otp.get().getInactiveDates();
        }
        logger.warn("Train not found: {}", id);
        throw new TrainException("Train not found with id : "+id);
    }

    @Override
    public boolean isActive(Long id) throws TrainException {
        Optional<TrainDetails> otp = trainRepository.findById(id);
        if(otp.isPresent()){
            logger.info("Fetched operational status for train id: {}", id);
            TrainDetails train = otp.get();
            if(train.getIsActive()){
                train.setIsActive(false);
            }else{
                train.setIsActive(true);
            }
            trainRepository.save(train);
            return train.getIsActive();
        }
        logger.warn("Train not found: {}", id);
        throw new TrainException("Train not found with id : "+id);

    }
}