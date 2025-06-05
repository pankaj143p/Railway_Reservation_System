package com.microservices.controllers;
import com.microservices.exception.TrainException;
import com.microservices.model.TrainDetails;
import com.microservices.service.TrainService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/trains")
public class TrainController {

    private final TrainService trainService;


    @PostMapping("/add")
    public ResponseEntity<String> addTrain(@RequestBody TrainDetails req) {
        String newTrain = trainService.addTrain(req);
        return ResponseEntity.ok(newTrain);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainDetails> getTrainById(@PathVariable Long id) throws TrainException {
        TrainDetails train = trainService.getTrainById(id);
        return ResponseEntity.ok(train);
    }


    @GetMapping()
    public ResponseEntity<List<TrainDetails>> getAllTrain() {
        List<TrainDetails> trainList = trainService.getAllTrains();
        return new ResponseEntity<>(trainList, HttpStatus.OK);
    }

    @GetMapping("/search")
    public List<TrainDetails> searchTrain(@RequestParam String keyword) {
        return trainService.searchTrains(keyword);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<TrainDetails> updateTrain(@PathVariable Long id, @RequestBody TrainDetails train) throws TrainException {
        TrainDetails updateTrain = trainService.updateTrain(id, train);
        return new ResponseEntity<>(updateTrain, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTrain(@PathVariable Long id) throws TrainException {
        trainService.deleteTrain(id);
        return new ResponseEntity<>("Train Deleted", HttpStatus.ACCEPTED);
    }

    @GetMapping("/today")
    public List<TrainDetails> getTodayTrains() {
        return trainService.getTodayTrains();
    }

    @GetMapping("/byDate")
    public List<TrainDetails> getByDate(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return trainService.getTrainsByDate(date);
    }

    @GetMapping("/route")
    public List<TrainDetails> getByRoute(@RequestParam String source, @RequestParam String destination) {
        return trainService.getTrainsBySourceAndDestination(source, destination);
    }

    @PutMapping("/{id}/seats/decrease")
    public ResponseEntity<String> decreaseSeats(@PathVariable Long id, @RequestParam int count, @RequestParam LocalDate journeyDate) {
        String res = trainService.decreaseSeats(id, count, journeyDate);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PutMapping("/{id}/seats/increase")
    public ResponseEntity<String> increaseSeats(@PathVariable Long id, @RequestParam int count) {
        String res = trainService.increaseSeats(id, count);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}