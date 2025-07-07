package com.microservices.controllers;

import com.microservices.exception.TrainException;
import com.microservices.model.TrainDetails;
import com.microservices.service.TrainService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/trains")
public class TrainController {

    private static final Logger logger = LoggerFactory.getLogger(TrainController.class);
    private final TrainService trainService;

    // Add a new train
    @PostMapping("/add")
    public ResponseEntity<?> addTrain(@Valid @RequestBody TrainDetails req) {
        try {
            TrainDetails newTrain = trainService.addTrain(req);
            logger.info("Train added: {}", newTrain.getTrainName());
            return ResponseEntity.ok(newTrain);
        } catch (Exception e) {
            logger.error("Failed to add train: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Get train by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<?> getTrainById(@PathVariable Long id) {
        try {
            TrainDetails train = trainService.getTrainById(id);
            logger.info("Fetched train by id: {}", id);
            return ResponseEntity.ok(train);
        } catch (TrainException e) {
            logger.error("Train not found: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Get all trains
    @GetMapping("/all")
    public ResponseEntity<List<TrainDetails>> getAllTrain() {
        List<TrainDetails> trainList = trainService.getAllTrains();
        logger.info("Fetched all trains, count: {}", trainList.size());
        return new ResponseEntity<>(trainList, HttpStatus.OK);
    }

    // Search trains by keyword
    @GetMapping("/search")
    public ResponseEntity<?> searchTrain(@RequestParam String keyword) {
        try {
            List<TrainDetails> trains = trainService.searchTrains(keyword);
            logger.info("Searched trains with keyword: {}", keyword);
            return ResponseEntity.ok(trains);
        } catch (Exception e) {
            logger.error("Search failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Update train details
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTrain(@PathVariable Long id, @Valid @RequestBody TrainDetails train) {
        try {
            TrainDetails updateTrain = trainService.updateTrain(id, train);
            logger.info("Updated train: {}", id);
            return new ResponseEntity<>(updateTrain, HttpStatus.OK);
        } catch (TrainException e) {
            logger.error("Update failed for train {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Delete train by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTrain(@PathVariable Long id) {
        try {
            trainService.deleteTrain(id);
            logger.info("Deleted train: {}", id);
            return new ResponseEntity<>("Train Deleted", HttpStatus.ACCEPTED);
        } catch (TrainException e) {
            logger.error("Delete failed for train {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Get today's trains
    @GetMapping("/today")
    public ResponseEntity<List<TrainDetails>> getTodayTrains() {
        List<TrainDetails> trains = trainService.getTodayTrains();
        logger.info("Fetched today's trains, count: {}", trains.size());
        return ResponseEntity.ok(trains);
    }

    // Get trains by date
    @GetMapping("/byDate")
    public ResponseEntity<List<TrainDetails>> getByDate(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<TrainDetails> trains = trainService.getTrainsByDate(date);
        logger.info("Fetched trains by date: {}", date);
        return ResponseEntity.ok(trains);
    }

    // Get trains by route
    @GetMapping("/route")
    public ResponseEntity<List<TrainDetails>> getByRoute(@RequestParam String source, @RequestParam String destination) {
        List<TrainDetails> trains = trainService.getTrainsBySourceAndDestination(source, destination);
        logger.info("Fetched trains from {} to {}, count: {}", source, destination, trains.size());
        return ResponseEntity.ok(trains);
    }

    // Decrease seats for a train
    @PutMapping("/{id}/seats/decrease")
    public ResponseEntity<?> decreaseSeats(@PathVariable Long id, @RequestParam int count) {
        try {
            String res = trainService.decreaseSeats(id, count);
            logger.info("Decreased seats for train {}: {}", id, res);
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Failed to decrease seats for train {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Increase seats for a train
    @PutMapping("/{id}/seats/increase")
    public ResponseEntity<?> increaseSeats(@PathVariable Long id, @RequestParam int count) {
        try {
            String res = trainService.increaseSeats(id, count);
            logger.info("Increased seats for train {}: {}", id, res);
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Failed to increase seats for train {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

  @GetMapping("/operational-status/{id}")
    public String getOperationalStatus(@PathVariable Long id) {
          try {
            String opr = trainService.getOperationalStatus(id);
            logger.info("Fetched train by id: {}", id);
            return opr;
        } catch (TrainException e) {
            logger.error("Train not found: {}", id);
            return "Train not found";
        }
    }

}