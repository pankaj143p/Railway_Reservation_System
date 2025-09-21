package com.microservices.controllers;

import com.microservices.dto.SeatConfigurationRequest;
import com.microservices.dto.SeatConfigurationResponse;
import com.microservices.dto.TrainSeatOverview;
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
import java.math.BigDecimal;
import java.time.LocalDate;
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
    public ResponseEntity<List<TrainDetails>> getByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<TrainDetails> trains = trainService.getTrainsByDate(date);
        logger.info("Fetched trains by date: {}", date);
        return ResponseEntity.ok(trains);
    }

    // Get trains by route
    @GetMapping("/route")
    public ResponseEntity<List<TrainDetails>> getByRoute(@RequestParam String source,
            @RequestParam String destination) {
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

    @PutMapping("/toggle-active/{id}")
    public ResponseEntity<Boolean> toggleActiveStatus(@PathVariable Long id) {
    try {
        boolean isActive = trainService.toggleActiveStatus(id);
        return ResponseEntity.ok(isActive);
    } catch (TrainException e) {
        logger.error("Error toggling active status for train {}: {}", id, e.getMessage());
        return ResponseEntity.notFound().build();
    }
}
    // Add this to your TrainController class

    @GetMapping("/getAllInActiveDates/{id}")
    public ResponseEntity<List<LocalDate>> getInactiveDates(@PathVariable Long id) {
        try {
            List<LocalDate> inactiveDates = trainService.getALlInActiveDates(id);
            return ResponseEntity.ok(inactiveDates);
        } catch (TrainException e) {
            logger.error("Error fetching inactive dates for train {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Update seat configuration for a train
    @PutMapping("/{id}/seat-config")
    public ResponseEntity<?> updateSeatConfiguration(
            @PathVariable Long id,
            @RequestParam Integer sleeperSeats,
            @RequestParam Integer ac2Seats,
            @RequestParam Integer ac1Seats) {
        try {
            TrainDetails train = trainService.getTrainById(id);
            train.setSleeperSeats(sleeperSeats);
            train.setAc2Seats(ac2Seats);
            train.setAc1Seats(ac1Seats);
            TrainDetails updatedTrain = trainService.updateTrain(id, train);
            logger.info("Updated seat configuration for train: {}", id);
            return ResponseEntity.ok(updatedTrain);
        } catch (TrainException e) {
            logger.error("Failed to update seat configuration for train {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Update pricing for a train
    @PutMapping("/{id}/pricing")
    public ResponseEntity<?> updatePricing(
            @PathVariable Long id,
            @RequestParam java.math.BigDecimal sleeperPrice,
            @RequestParam java.math.BigDecimal ac2Price,
            @RequestParam java.math.BigDecimal ac1Price) {
        try {
            TrainDetails train = trainService.getTrainById(id);
            train.setSleeperPrice(sleeperPrice);
            train.setAc2Price(ac2Price);
            train.setAc1Price(ac1Price);
            TrainDetails updatedTrain = trainService.updateTrain(id, train);
            logger.info("Updated pricing for train: {}", id);
            return ResponseEntity.ok(updatedTrain);
        } catch (TrainException e) {
            logger.error("Failed to update pricing for train {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Get seat configuration for a train
    @GetMapping("/{id}/seat-config")
    public ResponseEntity<SeatConfigurationResponse> getSeatConfiguration(@PathVariable Long id) {
        try {
            TrainDetails train = trainService.getTrainById(id);
            SeatConfigurationResponse seatConfig = SeatConfigurationResponse.builder()
                    .trainId(train.getTrainId())
                    .trainName(train.getTrainName())
                    .sleeperSeats(train.getSleeperSeats())
                    .ac2Seats(train.getAc2Seats())
                    .ac1Seats(train.getAc1Seats())
                    .totalSeats(train.getTotalSeats())
                    .sleeperPrice(train.getSleeperPrice())
                    .ac2Price(train.getAc2Price())
                    .ac1Price(train.getAc1Price())
                    .sleeperRangeStart(train.getSeatRangeStart("SLEEPER"))
                    .sleeperRangeEnd(train.getSeatRangeEnd("SLEEPER"))
                    .ac2RangeStart(train.getSeatRangeStart("AC2"))
                    .ac2RangeEnd(train.getSeatRangeEnd("AC2"))
                    .ac1RangeStart(train.getSeatRangeStart("AC1"))
                    .ac1RangeEnd(train.getSeatRangeEnd("AC1"))
                    .build();
            return ResponseEntity.ok(seatConfig);
        } catch (TrainException e) {
            logger.error("Failed to get seat configuration for train {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Admin endpoint to bulk update seat configuration with pricing
    @PutMapping("/{id}/admin/seat-config")
    public ResponseEntity<?> adminUpdateSeatConfiguration(
            @PathVariable Long id,
            @RequestBody @Valid SeatConfigurationRequest request) {
        try {
            TrainDetails train = trainService.getTrainById(id);
            
            // Update seat counts
            train.setSleeperSeats(request.getSleeperSeats());
            train.setAc2Seats(request.getAc2Seats());
            train.setAc1Seats(request.getAc1Seats());
            
            // Update pricing
            train.setSleeperPrice(request.getSleeperPrice());
            train.setAc2Price(request.getAc2Price());
            train.setAc1Price(request.getAc1Price());
            
            // Update total seats
            int totalSeats = request.getSleeperSeats() + request.getAc2Seats() + request.getAc1Seats();
            train.setTotalSeats(totalSeats);
            
            TrainDetails updatedTrain = trainService.updateTrain(id, train);
            logger.info("Admin updated complete seat configuration for train: {}", id);
            return ResponseEntity.ok(updatedTrain);
        } catch (TrainException e) {
            logger.error("Failed to update seat configuration for train {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error updating seat configuration for train {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Admin endpoint to get seat class analytics
    @GetMapping("/{id}/admin/seat-analytics")
    public ResponseEntity<?> getSeatClassAnalytics(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Map<String, Object> analytics = trainService.getSeatClassAnalytics(id, date);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            logger.error("Failed to get seat analytics for train {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Admin endpoint to reset all seat configuration to default ratios
    @PutMapping("/{id}/admin/reset-seats")
    public ResponseEntity<?> resetSeatConfiguration(
            @PathVariable Long id,
            @RequestParam Integer totalSeats) {
        try {
            TrainDetails train = trainService.getTrainById(id);
            
            // Apply default ratios: Sleeper:AC2:AC1 = 50:20:30
            int sleeperSeats = (int) Math.round(totalSeats * 0.5);
            int ac2Seats = (int) Math.round(totalSeats * 0.2);
            int ac1Seats = totalSeats - sleeperSeats - ac2Seats; // Remaining seats for AC1
            
            train.setSleeperSeats(sleeperSeats);
            train.setAc2Seats(ac2Seats);
            train.setAc1Seats(ac1Seats);
            train.setTotalSeats(totalSeats);
            
            // Set default prices
            train.setSleeperPrice(new BigDecimal("300"));
            train.setAc2Price(new BigDecimal("700"));
            train.setAc1Price(new BigDecimal("1300"));
            
            TrainDetails updatedTrain = trainService.updateTrain(id, train);
            logger.info("Reset seat configuration to defaults for train: {}", id);
            return ResponseEntity.ok(updatedTrain);
        } catch (TrainException e) {
            logger.error("Failed to reset seat configuration for train {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Admin endpoint to get all trains with seat configuration
    @GetMapping("/admin/seat-overview")
    public ResponseEntity<List<TrainSeatOverview>> getTrainSeatOverview() {
        try {
            List<TrainDetails> trains = trainService.getAllActiveTrains();
            List<TrainSeatOverview> overview = trains.stream()
                .map(train -> TrainSeatOverview.builder()
                    .trainId(train.getTrainId())
                    .trainName(train.getTrainName())
                    .source(train.getSource())
                    .destination(train.getDestination())
                    .totalSeats(train.getTotalSeats())
                    .sleeperSeats(train.getSleeperSeats())
                    .ac2Seats(train.getAc2Seats())
                    .ac1Seats(train.getAc1Seats())
                    .sleeperPrice(train.getSleeperPrice())
                    .ac2Price(train.getAc2Price())
                    .ac1Price(train.getAc1Price())
                    .isConfigured(train.getSleeperSeats() != null && 
                                 train.getAc2Seats() != null && 
                                 train.getAc1Seats() != null)
                    .build())
                .toList();
            return ResponseEntity.ok(overview);
        } catch (Exception e) {
            logger.error("Failed to get train seat overview: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/admin/bulk-configure")
    public ResponseEntity<String> bulkConfigureUnconfiguredTrains(
            @RequestParam int totalSeats,
            @RequestParam int sleeperRatio,
            @RequestParam int ac2Ratio,
            @RequestParam int ac1Ratio) {
        try {
            if (sleeperRatio + ac2Ratio + ac1Ratio != 100) {
                return ResponseEntity.badRequest().body("Seat class ratios must sum to 100%");
            }
            
            String result = trainService.bulkConfigureUnconfiguredTrains(totalSeats, sleeperRatio, ac2Ratio, ac1Ratio);
            logger.info("Bulk configuration result: {}", result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Failed to bulk configure trains: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to bulk configure trains: " + e.getMessage());
        }
    }

    // IRCTC-like search with class-wise availability
    @GetMapping("/search/advanced")
    public ResponseEntity<?> searchTrainsWithAvailability(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<com.microservices.dto.TrainSearchDTO> trains = trainService.searchTrainsWithAvailability(source, destination, date);
            logger.info("Advanced search from {} to {} on {}, found {} trains", source, destination, date, trains.size());
            return ResponseEntity.ok(trains);
        } catch (Exception e) {
            logger.error("Advanced search failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Get seat availability by class for a specific train and date
    @GetMapping("/{trainId}/seats/{date}")
    public ResponseEntity<?> getSeatAvailability(
            @PathVariable Long trainId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<com.microservices.dto.SeatAvailabilityDTO> availability = trainService.getSeatAvailabilityByClass(trainId, date);
            return ResponseEntity.ok(availability);
        } catch (Exception e) {
            logger.error("Failed to get seat availability for train {} on {}: {}", trainId, date, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Get available seat numbers for a specific class
    @GetMapping("/{trainId}/available-seats")
    public ResponseEntity<?> getAvailableSeats(
            @PathVariable Long trainId,
            @RequestParam String seatClass,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<Integer> availableSeats = trainService.getAvailableSeats(trainId, seatClass, date);
            return ResponseEntity.ok(availableSeats);
        } catch (Exception e) {
            logger.error("Failed to get available seats for train {} class {} on {}: {}", trainId, seatClass, date, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}


