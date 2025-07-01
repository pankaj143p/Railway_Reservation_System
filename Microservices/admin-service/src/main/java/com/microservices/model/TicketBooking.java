package com.microservices.model;
import com.microservices.domain.TicketStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;


@Data
@Entity
public class TicketBooking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ticket_id")
    private Long ticket_id;

    private String fullName;
    private int age;
    private String email;
    private String ticketNumber;
    private LocalDateTime bookingDate;

    private Long trainId;
    private String trainName;
    private String source;
    private String destination;
    @Column(name = "no_of_seats")
    private int noOfSeats;
    private LocalDateTime departureTime;
    @Enumerated(EnumType.STRING)
    private TicketStatus status = TicketStatus.WAITING;
}
