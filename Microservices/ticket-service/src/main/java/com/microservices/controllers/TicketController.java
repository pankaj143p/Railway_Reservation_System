package com.microservices.controllers;

import com.microservices.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
public class TicketController {

     private final TicketService ticketService;

    @PostMapping("/book")
    public ResponseEntity<String> bookTicket(
            @RequestParam Long trainId,
            @RequestParam String fullName,
            @RequestParam int seatCount) {

        String result = ticketService.bookTicket(trainId, fullName, seatCount);
        return ResponseEntity.ok(result);
    }
}


