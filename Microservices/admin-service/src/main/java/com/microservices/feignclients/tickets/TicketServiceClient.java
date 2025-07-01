package com.microservices.feignclients.tickets;
import com.microservices.dto.TicketRequestDTO;
import com.microservices.dto.TicketResponseDTO;
import com.microservices.model.TicketBooking;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "ticket-service")
public interface TicketServiceClient {
    @PostMapping("/tickets/book/{train_id}")
    TicketResponseDTO bookTicket(@PathVariable("train_id") Long train_id, @RequestBody TicketRequestDTO req);

    @PutMapping("/tickets/cancel/{ticketId}")
    String cancelTicket(@PathVariable("ticketId") Long ticketId);

    @GetMapping("/tickets/{ticketId}")
    TicketBooking getTicketDetails(@PathVariable("ticketId") Long ticketId);

    @GetMapping("/tickets/all")
    List<TicketBooking> getAllTickets();
}
