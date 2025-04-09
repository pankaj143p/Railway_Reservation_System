package com.microservices.service;

import com.microservices.dto.TicketRequestDTO;
import com.microservices.dto.TicketResponseDTO;

public interface TicketService {
    TicketResponseDTO bookTicket(Long train_id,TicketRequestDTO req);
    String cancelTicket(Long ticketId);
    int getAvailableSeats(Long trainId);
    TicketResponseDTO getTicketDetails(Long ticket_id);
}


