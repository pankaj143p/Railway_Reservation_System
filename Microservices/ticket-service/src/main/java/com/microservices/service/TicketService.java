package com.microservices.service;

import com.microservices.dto.CancellationResponseDTO;
import com.microservices.dto.TicketRequestDTO;
import com.microservices.dto.TicketResponseDTO;
import com.microservices.model.TicketBooking;

import java.time.LocalDate;
import java.util.List;

public interface TicketService {
    TicketResponseDTO bookTicket(Long train_id,TicketRequestDTO req);
    String cancelTicket(Long ticketId);
    CancellationResponseDTO cancelTicketWithRefund(Long ticketId);
    // int getAvailableSeats(Long trainId);
    TicketBooking getTicketDetails(Long ticket_id);
    List<TicketBooking> getAllTickets();
    TicketBooking getTicketByOrderId(String orderId);
    TicketBooking updateTicket(Long id, TicketBooking updatedTicket);
    List<TicketBooking> getTicketByUserEmail(String userEmail);
    int getBookedSeatsCountByTrainAndDate(Long trainId, LocalDate date);
    // String getOperationalStatus(Long trainId);
}


