package com.microservices.feign;

import com.microservices.dto.TrainDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "train-service", url = "http://localhost:5010")
public interface TrainClient {
    @GetMapping("/trains/get/{id}")
    TrainDTO getTrainById(@PathVariable("id") Long id);
    @PutMapping("/trains/{id}/seats/decrease")
    String decreaseSeats(@PathVariable("id") Long trainId, @RequestParam("count") int count);
    @PutMapping("/trains/{id}/seats/increase")
    String increaseSeats(@PathVariable("id") Long trainId, @RequestParam("count") int count);
}
