package com.microservices.controllers;
import com.microservices.model.TrainDetails;
import com.microservices.service.TrainService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/train")

public class TrainController {

    private final TrainService trainService;


    @PostMapping("/add")
    public ResponseEntity<String> addTrain(@RequestBody TrainDetails req){
        String newTrain = trainService.addTrain(req);
        return ResponseEntity.ok(newTrain);
    }

    @GetMapping()
    public ResponseEntity<List<TrainDetails>> getAllTrain(){
        List<TrainDetails> trainList = trainService.getAllTrains();
        return new ResponseEntity<>(trainList,HttpStatus.OK);
    }

    @GetMapping("/search/{}")
    public List<TrainDetails> searchTrain(@RequestParam String keyword){
        return trainService.searchTrains(keyword);
    }
}