package com.microservices.controllers;

import com.microservices.dto.TicketRequestDTO;
import com.microservices.dto.TicketResponseDTO;
import com.microservices.model.TicketBooking;
import com.microservices.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping("/book/{train_id}")
    public ResponseEntity<TicketResponseDTO> bookTicket(@PathVariable Long train_id, @RequestBody TicketRequestDTO req) {

        TicketResponseDTO result = ticketService.bookTicket(train_id, req);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/cancel/{ticketId}")
    public ResponseEntity<String> cancelTicket(@PathVariable Long ticketId) {
        String result = ticketService.cancelTicket(ticketId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<TicketBooking> getTicketDetails(@PathVariable Long ticketId){
        TicketBooking ticket = ticketService.getTicketDetails(ticketId);
        return ResponseEntity.ok(ticket);
    }

}


