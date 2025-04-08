package com.microservices.controllers;

import com.microservices.dto.TicketRequest;
import com.microservices.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
public class TicketController {

     private final TicketService ticketService;

//    @PostMapping("/book")
//    public ResponseEntity<String> bookTicket(
//            @RequestParam Long trainId,
//            @RequestParam String fullName,
//            @RequestParam int seatCount) {
//
//        String result = ticketService.bookTicket(trainId, fullName, seatCount);
//        return ResponseEntity.ok(result);
//    }


    @PostMapping("/book")
    public ResponseEntity<String> bookTicket(@RequestBody TicketRequest req) {

        String result = ticketService.bookTicket(req.getTrainId(), req.getFullName(), req.getSeatCount());
        return ResponseEntity.ok(result);
    }
}


