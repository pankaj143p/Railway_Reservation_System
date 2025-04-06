package com.microservices.model;

import com.microservices.domain.TicketStatus;
import jakarta.persistence.*;

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

    private Long train_id;

    @Enumerated(EnumType.STRING)
    private TicketStatus status;
}
