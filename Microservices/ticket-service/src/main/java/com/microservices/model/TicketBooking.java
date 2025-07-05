package com.microservices.model;

import com.microservices.domain.TicketStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
public class TicketBooking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ticket_id")
    private Long ticket_id;

    @NotBlank(message = "Order ID is required")
    @Column(name = "order_id", unique = true, nullable = false)
    private String orderId;

    private String paymentId; // Razorpay payment ID for refunds

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Min(value = 0, message = "Age must be positive")
    private int age;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    private String ticketNumber;
   
    @Min(value = 1, message = "Amount must be positive")
    private int amount;

    private LocalDate bookingDate;

    @NotBlank(message = "User email is required")
    private String userEmail;

    @NotNull(message = "Train ID is required")
    private Long trainId;

    @NotBlank(message = "Train name is required")
    private String trainName;

    @NotBlank(message = "Source is required")
    private String source;

    @NotBlank(message = "Destination is required")
    private String destination;

    @Min(value = 1, message = "At least one seat must be booked")
    @Column(name = "no_of_seats")
    private int noOfSeats;

    private LocalDateTime departureTime;

    @Enumerated(EnumType.STRING)
    private TicketStatus status = TicketStatus.WAITING;
}