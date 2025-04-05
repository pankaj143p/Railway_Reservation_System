package com.microservices.service.implementation;

import com.microservices.model.TrainDetails;
import com.microservices.repository.TrainRepository;
import com.microservices.service.TrainServie;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainImplementation implements TrainServie {

    private final TrainRepository trainRepository;

    @Override
    public String addTrain(TrainDetails req) {
        TrainDetails train = new TrainDetails();
        train.setTrainName(req.getTrainName());
        train.setTotalSeats(req.getTotalSeats());
        train.setDestination(req.getDestination());
        train.setSource(req.getSource());
        train.setRoutes(req.getRoutes());
        train.setArrivalTime(req.getArrivalTime());
        train.setDepartureTime(req.getDepartureTime());
        trainRepository.save(train);
        return "Train added successfully";
    }

    @Override
    public String updateTrain(TrainDetails train, Long train_id) {

        return "";
    }

    @Override
    public List<TrainDetails> getAllTrains() {
        return trainRepository.findAll();
    }
}
