package com.microservices.controllers;

import com.microservices.dto.CancellationResponseDTO;
import com.microservices.dto.TicketRequestDTO;
import com.microservices.dto.TicketResponseDTO;
import com.microservices.exception.TicketException;
import com.microservices.model.TicketBooking;
import com.microservices.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
public class TicketController {

    private static final Logger logger = LoggerFactory.getLogger(TicketController.class);
    private final TicketService ticketService;

    @PostMapping("/book/{trainId}")
    public ResponseEntity<Object> bookTicket(@PathVariable Long trainId, @Valid @RequestBody TicketRequestDTO req) {
        try {
            TicketResponseDTO result = ticketService.bookTicket(trainId, req);
            logger.info("Ticket booked for trainId: {}", trainId);
            return ResponseEntity.ok(result);
        } catch (TicketException e) {
            logger.error("Booking failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/cancel/{ticketId}")
    public ResponseEntity<Object> cancelTicket(@PathVariable Long ticketId) {
        try {
            String result = ticketService.cancelTicket(ticketId);
            logger.info("Ticket cancelled: {}", ticketId);
            return ResponseEntity.ok(result);
        } catch (TicketException e) {
            logger.error("Cancellation failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/cancel-with-refund/{ticketId}")
    public ResponseEntity<Object> cancelTicketWithRefund(@PathVariable Long ticketId) {
        try {
            CancellationResponseDTO result = ticketService.cancelTicketWithRefund(ticketId);
            logger.info("Ticket cancelled with refund details: {}", ticketId);
            return ResponseEntity.ok(result);
        } catch (TicketException e) {
            logger.error("Cancellation with refund failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateTicket(
            @PathVariable Long id,
            @Valid @RequestBody TicketBooking updatedTicket
    ) {
        try {
            TicketBooking ticket = ticketService.updateTicket(id, updatedTicket);
            logger.info("Ticket updated: {}", id);
            return ResponseEntity.ok(ticket);
        } catch (TicketException e) {
            logger.error("Update failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<Object> getTicketDetails(@PathVariable Long ticketId){
        try {
            TicketBooking ticket = ticketService.getTicketDetails(ticketId);
            logger.info("Fetched ticket details: {}", ticketId);
            return ResponseEntity.ok(ticket);
        } catch (TicketException e) {
            logger.error("Fetch failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<TicketBooking>> getAllTickets(){
        List<TicketBooking> tickets = ticketService.getAllTickets();
        logger.info("Fetched all tickets, count: {}", tickets.size());
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Object> getTicketByOrderId(@PathVariable String orderId) {
        try {
            TicketBooking ticket = ticketService.getTicketByOrderId(orderId);
            logger.info("Fetched ticket by orderId: {}", orderId);
            return ResponseEntity.ok(ticket);
        } catch (TicketException e) {
            logger.error("Fetch by orderId failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/user/{userEmail}")
    public ResponseEntity<Object> getTicketByUserEmail(@PathVariable String userEmail) {
        try {
            List<TicketBooking> tickets = ticketService.getTicketByUserEmail(userEmail);
            logger.info("Fetched tickets for user email: {}", userEmail);
            return ResponseEntity.ok(tickets);
        } catch (TicketException e) {
            logger.error("Fetch by user email failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/availability/{trainId}")
    public ResponseEntity<Object> getAvailableSeats(@PathVariable Long trainId, @RequestParam String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            int bookedSeats = ticketService.getBookedSeatsCountByTrainAndDate(trainId, localDate);
            logger.info("Fetched booked seats count for train {} on date {}: {}", trainId, date, bookedSeats);
            return ResponseEntity.ok(bookedSeats);
        } catch (Exception e) {
            logger.error("Error fetching seat availability: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error fetching seat availability");
        }
    }

    // New endpoints for seat class management
    @GetMapping("/availability/{trainId}/class/{seatClass}")
    public ResponseEntity<Object> getAvailableSeatsByClass(
            @PathVariable Long trainId, 
            @PathVariable String seatClass,
            @RequestParam String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            int bookedSeats = ticketService.getBookedSeatsCountByClass(trainId, localDate, seatClass);
            logger.info("Fetched booked seats count for train {} class {} on date {}: {}", trainId, seatClass, date, bookedSeats);
            return ResponseEntity.ok(bookedSeats);
        } catch (Exception e) {
            logger.error("Error fetching seat availability by class: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error fetching seat availability by class");
        }
    }

    @GetMapping("/booking-summary/{trainId}")
    public ResponseEntity<Object> getBookingSummary(@PathVariable Long trainId, @RequestParam String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            java.util.Map<String, Object> summary = ticketService.getBookingSummaryByClass(trainId, localDate);
            logger.info("Fetched booking summary for train {} on date {}", trainId, date);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            logger.error("Error fetching booking summary: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error fetching booking summary");
        }
    }

    @GetMapping("/revenue/{trainId}")
    public ResponseEntity<Object> getRevenueByClass(@PathVariable Long trainId, @RequestParam String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            java.util.Map<String, Object> revenue = ticketService.getRevenueByClass(trainId, localDate);
            logger.info("Fetched revenue summary for train {} on date {}", trainId, date);
            return ResponseEntity.ok(revenue);
        } catch (Exception e) {
            logger.error("Error fetching revenue: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error fetching revenue");
        }
    }

    @GetMapping("/bookings/{trainId}")
    public ResponseEntity<Object> getTrainBookings(
            @PathVariable Long trainId, 
            @RequestParam String date,
            @RequestParam(required = false) String seatClass) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            List<TicketBooking> bookings;
            if (seatClass != null && !seatClass.isEmpty()) {
                bookings = ticketService.getBookingsByTrainDateAndClass(trainId, localDate, seatClass);
            } else {
                bookings = ticketService.getBookingsByTrainAndDate(trainId, localDate);
            }
            logger.info("Fetched {} bookings for train {} on date {}", bookings.size(), trainId, date);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            logger.error("Error fetching train bookings: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error fetching train bookings");
        }
    }
}

