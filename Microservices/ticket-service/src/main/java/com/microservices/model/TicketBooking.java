package com.microservices.model;

import com.microservices.domain.TicketStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class TicketBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long ticket_id;

    @Column(nullable = false)
    private String passengerName;

    private int age;

    private double tickedPrice;

    private String seatNumber;

    private Long trainId;

    private String fullName;

    private String mobileNo;

    private String email;

    private int age;

    @Enumerated(EnumType.STRING)
    private TicketStatus status;

    private LocalDateTime bookingTime;
}
