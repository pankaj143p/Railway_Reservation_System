package com.microservices.model;

import com.microservices.domain.TrainStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Entity
@Table(name = "train_details")
public class TrainDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long trainId;

    @NotBlank(message = "Train name is required")
    @Column(nullable = false)
    private String trainName;

    @NotBlank(message = "Source is required")
    @Column(nullable = false)
    private String source;

    @NotBlank(message = "Destination is required")
    @Column(nullable = false)
    private String destination;

    @Min(value = 1, message = "Total seats must be at least 1")
    @Column(nullable = false)
    private int totalSeats;

    @ElementCollection
    @NotEmpty(message = "Routes cannot be empty")
    private List<@NotBlank(message = "Route cannot be blank") String> routes;

    @ElementCollection
    @CollectionTable(name = "train_inactive_dates", joinColumns = @JoinColumn(name = "train_id"))
    @Column(name = "inactive_date")
    private List<LocalDate> inactiveDates;

    @NotNull(message = "Departure time is required")
    @Column(nullable = false)
    private LocalTime departureTime;

    @NotNull(message = "Arrival time is required")
    @Column(nullable = false)
    private LocalTime arrivalTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "train_status_enum")
    private TrainStatus status;

    @NotNull(message = "Amount is required")
    @Min(value = 0, message = "Amount must be non-negative")
    @Column(nullable = false)
    private Integer amount;

    @NotNull(message = "Date is required")
    @FutureOrPresent(message = "Date must be today or in the future")
    @Column(nullable = false)
    private LocalDate date;

    // New fields for admin management
    @Column(nullable = false, columnDefinition = "boolean default true")
    private Boolean isActive = true;

    @Column(length = 50)
    private String operationalStatus = "OPERATIONAL";

    @Column(length = 500)
    private String maintenanceNotes;

    // Setter for routes (for validation)
    public void setRoutes(List<String> routes2) {
        this.routes = routes2;
    }

    public void setInactiveDays(List<LocalDate> inactiveDates1) {
        this.inactiveDates = inactiveDates1;
    }
}











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
        train.setStatus(TrainStatus.ON_TIME);
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
    // @Override
    // public TrainDetails updateTrain(Long id, TrainDetails req) throws TrainException {
    //     Optional<TrainDetails> opt = trainRepository.findById(id);
    //     if(opt.isEmpty()){
    //         logger.warn("Train not found for update: {}", id);
    //         throw new TrainException("Train not exist with : "+id);
    //     }
    //     TrainDetails exTrain = opt.get();
    //     exTrain.setTrainName(req.getTrainName());
    //     exTrain.setTotalSeats(req.getTotalSeats());
    //     exTrain.setDestination(req.getDestination());
    //     exTrain.setSource(req.getSource());
    //     exTrain.setRoutes(req.getRoutes());
    //     exTrain.setArrivalTime(req.getArrivalTime());
    //     exTrain.setDepartureTime(req.getDepartureTime());
    //     exTrain.setStatus(req.getStatus()!=null ? req.getStatus() : TrainStatus.ON_TIME);
    //     exTrain.setAmount(req.getAmount());
    //     exTrain.setDate(req.getDate());
    //     exTrain.setInactiveDates(req.getInactiveDates());
    //     // Update new fields
    //     exTrain.setIsActive(req.getIsActive() != null ? req.getIsActive() : true);
    //     exTrain.setOperationalStatus(req.getOperationalStatus() != null ? req.getOperationalStatus() : "OPERATIONAL");
    //     exTrain.setMaintenanceNotes(req.getMaintenanceNotes());
    //     logger.info("Updated train: {}", id);
    //     return trainRepository.save(exTrain);
    // }
    
    // Update train details
@Override
public TrainDetails updateTrain(Long id, TrainDetails req) throws TrainException {
    Optional<TrainDetails> opt = trainRepository.findById(id);
    if(opt.isEmpty()){
        logger.warn("Train not found for update: {}", id);
        throw new TrainException("Train not exist with : "+id);
    }
    TrainDetails exTrain = opt.get();
    
    // Only update non-null fields to allow partial updates
    if (req.getTrainName() != null) {
        exTrain.setTrainName(req.getTrainName());
    }
    if (req.getTotalSeats() != 0) {
        exTrain.setTotalSeats(req.getTotalSeats());
    }
    if (req.getDestination() != null) {
        exTrain.setDestination(req.getDestination());
    }
    if (req.getSource() != null) {
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
    // Keep existing status if not provided, otherwise use the provided status
    if (req.getStatus() != null) {
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
    if (req.getOperationalStatus() != null) {
        exTrain.setOperationalStatus(req.getOperationalStatus());
    }
    if (req.getMaintenanceNotes() != null) {
        exTrain.setMaintenanceNotes(req.getMaintenanceNotes());
    }
    
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
    public List<LocalDate> getALlInActiveDates(Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getALlInActiveDates'");
    }
}















