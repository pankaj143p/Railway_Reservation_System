package com.microservices.controllers;
import com.microservices.model.TrainDetails;
import com.microservices.service.TrainServie;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/train")
@RequiredArgsConstructor
public class TrainController {

    private final TrainServie trainServie;

    @PostMapping("/add")
    public ResponseEntity<String> addTrain(@RequestBody TrainDetails req){
        String newTrain = trainServie.addTrain(req);
        return ResponseEntity.ok(newTrain);
    }

    @GetMapping()
    public ResponseEntity<List<TrainDetails>> getAllTrain(){
       List<TrainDetails> trainList = trainServie.getAllTrains();
       return new ResponseEntity<>(trainList,HttpStatus.OK);
    }
}
