package com.microservices.service;

import com.microservices.dto.CancellationResponseDTO;
import com.microservices.dto.TicketRequestDTO;
import com.microservices.dto.TicketResponseDTO;
import com.microservices.model.TicketBooking;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface TicketService {
    TicketResponseDTO bookTicket(Long trainId, TicketRequestDTO req);
    String cancelTicket(Long ticketId);
    CancellationResponseDTO cancelTicketWithRefund(Long ticketId);
    TicketBooking getTicketDetails(Long ticketId);
    List<TicketBooking> getAllTickets();
    TicketBooking getTicketByOrderId(String orderId);
    TicketBooking updateTicket(Long id, TicketBooking updatedTicket);
    List<TicketBooking> getTicketByUserEmail(String userEmail);
    int getBookedSeatsCountByTrainAndDate(Long trainId, LocalDate date);
    
    // New methods for seat class management
    int getBookedSeatsCountByClass(Long trainId, LocalDate date, String seatClass);
    Map<String, Object> getBookingSummaryByClass(Long trainId, LocalDate date);
    Map<String, Object> getRevenueByClass(Long trainId, LocalDate date);
    List<TicketBooking> getBookingsByTrainDateAndClass(Long trainId, LocalDate date, String seatClass);
    List<TicketBooking> getBookingsByTrainAndDate(Long trainId, LocalDate date);
}


