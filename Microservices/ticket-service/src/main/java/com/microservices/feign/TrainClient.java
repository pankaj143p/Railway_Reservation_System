package com.microservices.feign;

import com.microservices.dto.TrainDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "train-service", url = "http://localhost:5010")
public interface TrainClient {
    @GetMapping("/trains/{id}")
    TrainDTO getTrainById(@PathVariable("id") Long id);
}
