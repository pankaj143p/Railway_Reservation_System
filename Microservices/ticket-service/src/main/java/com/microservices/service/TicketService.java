package com.microservices.service;

public interface TicketService {
    String bookTicket(Long trainId, String fullName, int seatCount);
    String cancelTicket(Long ticketId);
    int getAvailableSeats(Long trainId);
}
