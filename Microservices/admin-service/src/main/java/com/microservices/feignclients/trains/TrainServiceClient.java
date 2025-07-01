package com.microservices.feignclients.trains;

import com.microservices.model.TrainDetails;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@FeignClient(name = "train-service")
public interface TrainServiceClient {
    @PostMapping("/trains/add")
    String addTrain(@RequestBody TrainDetails req);

    @GetMapping("/trains/{id}")
    TrainDetails getTrainById(@PathVariable("id") Long id);

    @GetMapping("/trains")
    List<TrainDetails> getAllTrain();

    @GetMapping("/trains/search")
    List<TrainDetails> searchTrain(@RequestParam("keyword") String keyword);

    @PutMapping("/trains/update/{id}")
    TrainDetails updateTrain(@PathVariable("id") Long id, @RequestBody TrainDetails train);

    @DeleteMapping("/trains/{id}")
    String deleteTrain(@PathVariable("id") Long id);

    @GetMapping("/trains/today")
    List<TrainDetails> getTodayTrains();

    @GetMapping("/trains/byDate")
    List<TrainDetails> getByDate(@RequestParam("date") String date);

    @GetMapping("/trains/route")
    List<TrainDetails> getByRoute(@RequestParam("source") String source, @RequestParam("destination") String destination);

    @PutMapping("/trains/{id}/seats/decrease")
    String decreaseSeats(@PathVariable("id") Long id, @RequestParam("count") int count, @RequestParam("date") String date);

    @PutMapping("/trains/{id}/seats/increase")
    String increaseSeats(@PathVariable("id") Long id, @RequestParam("count") int count);
}
