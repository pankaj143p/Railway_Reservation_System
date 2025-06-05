package com.microservices.service.implementation;

import com.microservices.domain.TrainStatus;
import com.microservices.exception.TrainException;
import com.microservices.model.TrainDetails;
import com.microservices.model.TrainSeats;
import com.microservices.repository.TrainRepository;
import com.microservices.repository.TrainSeatsRepository;
import com.microservices.service.TrainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TrainServiceImplementation implements TrainService {


    private final TrainRepository trainRepository;


    private TrainSeatsRepository trainSeatsRepository;

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
        train.setStatus(TrainStatus.ON_TIME);
        train.setNoOfSeats(req.getNoOfSeats());
        trainRepository.save(train);
        return "Train added successfully";
    }

    @Override
    public List<TrainDetails> getAllTrains() {
        return trainRepository.findAll();
    }

    @Override
    public List<TrainDetails> searchTrains(String keyword) {
        return trainRepository.findBytrainNameStartingWithIgnoreCase(keyword);
    }

    @Override
    public TrainDetails updateTrain(Long id, TrainDetails req) throws TrainException {
        Optional<TrainDetails> opt = trainRepository.findById(id);
        if(opt.isEmpty()){
            throw new TrainException("train not exist with : "+id);

        }
        TrainDetails exTrain = opt.get();
        exTrain.setTrainName(req.getTrainName());
        exTrain.setTotalSeats(req.getTotalSeats());
        exTrain.setDestination(req.getDestination());
        exTrain.setSource(req.getSource());
        exTrain.setRoutes(req.getRoutes());
        exTrain.setArrivalTime(req.getArrivalTime());
        exTrain.setDepartureTime(req.getDepartureTime());
        exTrain.setStatus(TrainStatus.ON_TIME);
        exTrain.setNoOfSeats(req.getNoOfSeats());
        return trainRepository.save(exTrain);
    }

    @Override
    public void deleteTrain(Long id) throws TrainException {
        Optional<TrainDetails> otp = trainRepository.findById(id);
        if(otp.isEmpty()){
            throw new TrainException("Train not found with id : "+id);
        }

        trainRepository.deleteById(id);
    }

    @Override
    public TrainDetails getTrainById(Long id) throws TrainException {
        Optional<TrainDetails> otp = trainRepository.findById(id);
        if(otp.isPresent()){
            return otp.get();
        }
        throw new TrainException("Train not found with id : "+id);
    }

    @Override
    public TrainDetails markTrainDelayed(Long id) {
        return null;
    }

    @Override
    public TrainDetails cancelTrain(Long id) {
        return null;
    }

    @Override
    public String getTrainStatus(Long id) {
        return "";
    }

    @Override
    public List<TrainDetails> getTodayTrains() {
        return trainRepository.findBydepartureTime(LocalDate.now());
    }

    @Override
    public List<TrainDetails> getTrainsByDate(LocalDate date) {
        return trainRepository.findBydepartureTime(date);
    }

    @Override
    public List<TrainDetails> getTrainsBySourceAndDestination(String source, String destination) {
        return trainRepository.findBySourceAndDestination(source, destination);
    }

//    @Override
//    public String decreaseSeats(Long id, int count, String JourneyDate) {
//        TrainDetails train = trainRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Train not found"));
//
//        if(train.getNoOfSeats() < count) {
//            return "Not enough seats";
//        }
//
//        train.setNoOfSeats(train.getNoOfSeats() - count);
//        trainRepository.save(train);
//        return "Seats updated successfully";
//    }


    @Override
    public String decreaseSeats(Long id, int count, LocalDate journeyDate) {
        TrainDetails train = new TrainDetails();
        TrainSeats trainSeats = trainSeatsRepository.findBytrainIdAndJourneyDate(id, journeyDate)
                .orElseGet(() -> {
                    TrainSeats newSeats = new TrainSeats();
                    newSeats.setTrainId(id);
                    newSeats.setJourneyDate(journeyDate);
                    newSeats.setAvailableSeats(train.getTotalSeats());
                    return newSeats;
                });
            if(trainSeats.getAvailableSeats()<count) {
                throw new RuntimeException("Not Enough available seats on " + journeyDate);
            }
           trainSeats.setAvailableSeats(trainSeats.getAvailableSeats()-count);
           trainSeatsRepository.save(trainSeats);
        return "Seats updated successfully";
    }



    @Override
    public String increaseSeats(Long id, int count) {
        TrainDetails train = trainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Train not found"));
        train.setNoOfSeats(train.getNoOfSeats() + count);
        trainRepository.save(train);
        return "Seats updated successfully";
    }

}