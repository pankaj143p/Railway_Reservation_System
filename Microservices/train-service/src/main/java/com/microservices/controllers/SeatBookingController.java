package com.microservices.controllers;

import com.microservices.dto.SeatAvailabilityResponse;
import com.microservices.dto.SeatBookingRequest;
import com.microservices.dto.SeatBookingResponse;
import com.microservices.service.SeatBookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
@Tag(name = "Seat Booking API", description = "APIs for managing train seat bookings")
@CrossOrigin(origins = "*")
public class SeatBookingController {

    private final SeatBookingService seatBookingService;

    @Operation(summary = "Book seats", description = "Book one or more seats for a train")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Seats booked successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid booking request"),
        @ApiResponse(responseCode = "409", description = "Seats not available")
    })
    @PostMapping("/book")
    public ResponseEntity<SeatBookingResponse> bookSeats(@Valid @RequestBody SeatBookingRequest request) {
        log.info("Booking seats request: {}", request);
        SeatBookingResponse response = seatBookingService.bookSeats(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Book specific seat", description = "Book a specific seat number")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Seat booked successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid seat number or details"),
        @ApiResponse(responseCode = "409", description = "Seat not available")
    })
    @PostMapping("/book-specific")
    public ResponseEntity<SeatBookingResponse> bookSpecificSeat(
            @Parameter(description = "Train ID") @RequestParam Long trainId,
            @Parameter(description = "Seat number") @RequestParam Integer seatNumber,
            @Parameter(description = "Seat class (SLEEPER, AC2, AC1)") @RequestParam String seatClass,
            @Parameter(description = "Booking date (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate bookingDate,
            @Parameter(description = "Passenger name") @RequestParam String passengerName,
            @Parameter(description = "Passenger email") @RequestParam String passengerEmail,
            @Parameter(description = "Passenger phone") @RequestParam(required = false) String passengerPhone) {
        
        log.info("Booking specific seat {} for train {} on {}", seatNumber, trainId, bookingDate);
        SeatBookingResponse response = seatBookingService.bookSpecificSeat(
                trainId, seatNumber, seatClass, bookingDate, passengerName, passengerEmail, passengerPhone);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Get seat availability", description = "Get seat availability for a train on a specific date")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Seat availability retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Train not found")
    })
    @GetMapping("/availability/{trainId}")
    public ResponseEntity<SeatAvailabilityResponse> getSeatAvailability(
            @Parameter(description = "Train ID") @PathVariable Long trainId,
            @Parameter(description = "Date (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        log.info("Getting seat availability for train {} on {}", trainId, date);
        SeatAvailabilityResponse response = seatBookingService.getSeatAvailability(trainId, date);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Check seat availability", description = "Check if a specific seat is available")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Seat availability status retrieved"),
        @ApiResponse(responseCode = "404", description = "Train not found")
    })
    @GetMapping("/check-availability")
    public ResponseEntity<Boolean> isSeatAvailable(
            @Parameter(description = "Train ID") @RequestParam Long trainId,
            @Parameter(description = "Seat number") @RequestParam Integer seatNumber,
            @Parameter(description = "Seat class") @RequestParam String seatClass,
            @Parameter(description = "Date (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        log.info("Checking availability for seat {} in {} class for train {} on {}", seatNumber, seatClass, trainId, date);
        Boolean isAvailable = seatBookingService.isSeatAvailable(trainId, seatNumber, seatClass, date);
        return ResponseEntity.ok(isAvailable);
    }

    @Operation(summary = "Get next available seat", description = "Get the next available seat number in a class")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Next available seat retrieved"),
        @ApiResponse(responseCode = "404", description = "No seats available")
    })
    @GetMapping("/next-available")
    public ResponseEntity<Integer> getNextAvailableSeat(
            @Parameter(description = "Train ID") @RequestParam Long trainId,
            @Parameter(description = "Seat class") @RequestParam String seatClass,
            @Parameter(description = "Date (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        log.info("Getting next available seat in {} class for train {} on {}", seatClass, trainId, date);
        Integer nextSeat = seatBookingService.getNextAvailableSeat(trainId, seatClass, date);
        if (nextSeat == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(nextSeat);
    }

    @Operation(summary = "Get booked seats", description = "Get list of booked seat numbers for a class")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Booked seats list retrieved"),
        @ApiResponse(responseCode = "404", description = "Train not found")
    })
    @GetMapping("/booked-seats")
    public ResponseEntity<List<Integer>> getBookedSeats(
            @Parameter(description = "Train ID") @RequestParam Long trainId,
            @Parameter(description = "Seat class") @RequestParam String seatClass,
            @Parameter(description = "Date (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        log.info("Getting booked seats in {} class for train {} on {}", seatClass, trainId, date);
        List<Integer> bookedSeats = seatBookingService.getBookedSeats(trainId, seatClass, date);
        return ResponseEntity.ok(bookedSeats);
    }

    @Operation(summary = "Get booking details", description = "Get details of a specific booking")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Booking details retrieved"),
        @ApiResponse(responseCode = "404", description = "Booking not found")
    })
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<SeatBookingResponse> getBookingDetails(
            @Parameter(description = "Booking ID") @PathVariable Long bookingId) {
        
        log.info("Getting booking details for ID: {}", bookingId);
        SeatBookingResponse response = seatBookingService.getBookingDetails(bookingId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Cancel booking", description = "Cancel a seat booking")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Booking cancelled successfully"),
        @ApiResponse(responseCode = "404", description = "Booking not found")
    })
    @PutMapping("/cancel/{bookingId}")
    public ResponseEntity<String> cancelBooking(
            @Parameter(description = "Booking ID") @PathVariable Long bookingId) {
        
        log.info("Cancelling booking ID: {}", bookingId);
        seatBookingService.cancelBooking(bookingId);
        return ResponseEntity.ok("Booking cancelled successfully");
    }

    @Operation(summary = "Get passenger bookings", description = "Get all bookings for a passenger")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Passenger bookings retrieved"),
        @ApiResponse(responseCode = "404", description = "No bookings found")
    })
    @GetMapping("/passenger-bookings")
    public ResponseEntity<List<SeatBookingResponse>> getPassengerBookings(
            @Parameter(description = "Passenger email") @RequestParam String email) {
        
        log.info("Getting bookings for passenger: {}", email);
        List<SeatBookingResponse> bookings = seatBookingService.getPassengerBookings(email);
        return ResponseEntity.ok(bookings);
    }

    @Operation(summary = "Validate seat for class", description = "Check if seat number is valid for the specified class")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Seat validation result"),
        @ApiResponse(responseCode = "404", description = "Train not found")
    })
    @GetMapping("/validate-seat")
    public ResponseEntity<Boolean> isValidSeatForClass(
            @Parameter(description = "Train ID") @RequestParam Long trainId,
            @Parameter(description = "Seat number") @RequestParam Integer seatNumber,
            @Parameter(description = "Seat class") @RequestParam String seatClass) {
        
        log.info("Validating seat {} for {} class in train {}", seatNumber, seatClass, trainId);
        Boolean isValid = seatBookingService.isValidSeatForClass(trainId, seatNumber, seatClass);
        return ResponseEntity.ok(isValid);
    }
}
