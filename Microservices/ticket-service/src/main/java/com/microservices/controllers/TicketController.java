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

    @PostMapping("/book/{train_id}")
    public ResponseEntity<?> bookTicket(@PathVariable Long train_id, @Valid @RequestBody TicketRequestDTO req) {
        try {
            TicketResponseDTO result = ticketService.bookTicket(train_id, req);
            logger.info("Ticket booked for train_id: {}", train_id);
            return ResponseEntity.ok(result);
        } catch (TicketException e) {
            logger.error("Booking failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/cancel/{ticketId}")
    public ResponseEntity<?> cancelTicket(@PathVariable Long ticketId) {
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
    public ResponseEntity<?> cancelTicketWithRefund(@PathVariable Long ticketId) {
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
    public ResponseEntity<?> updateTicket(
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
    public ResponseEntity<?> getTicketDetails(@PathVariable Long ticketId){
        try {
            TicketBooking ticket = ticketService.getTicketDetails(ticketId);
            logger.info("Fetched ticket details: {}", ticketId);
            return ResponseEntity.ok(ticket);
        } catch (TicketException e) {
            logger.error("Fetch failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("all")
    public ResponseEntity<List<TicketBooking>> getAllTickets(){
        List<TicketBooking> tickets = ticketService.getAllTickets();
        logger.info("Fetched all tickets, count: {}", tickets.size());
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getTicketByOrderId(@PathVariable String orderId) {
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
    public ResponseEntity<?> getTicketByUserEmail(@PathVariable String userEmail) {
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
    public ResponseEntity<?> getAvailableSeats(@PathVariable Long trainId, @RequestParam String date) {
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
}

