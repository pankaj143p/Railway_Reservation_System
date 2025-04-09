package com.microservices.controllers;

import com.microservices.dto.TicketRequestDTO;
import com.microservices.dto.TicketResponseDTO;
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


    @PostMapping("/book/{train_id}")
    public ResponseEntity<TicketResponseDTO> bookTicket(@PathVariable Long train_id, @RequestBody TicketRequestDTO req) {

        TicketResponseDTO result = ticketService.bookTicket(train_id, req);
        return ResponseEntity.ok(result);
    }
}


