package com.microservices.model;

import com.microservices.domain.TicketStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class TicketBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long ticket_id;

    @Column(nullable = false)
    private String passengerName;

    private int age;

    private double tickedPrice;

    private String seatNumber;

    private int seatCount;

    private Long trainId;

    private String fullName;

    private String mobileNo;

    private String email;

    @Enumerated(EnumType.STRING)
    private TicketStatus status;

    private LocalDateTime bookingTime;
}
