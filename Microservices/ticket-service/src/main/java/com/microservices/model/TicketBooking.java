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

    // New fields for seat booking system
    @Pattern(regexp = "^(SLEEPER|AC2|AC1)$", message = "Seat class must be SLEEPER, AC2, or AC1")
    @Column(name = "seat_class")
    private String seatClass = "SLEEPER";

    @Column(name = "seat_numbers", columnDefinition = "TEXT")
    private String seatNumbers; // JSON array of seat numbers: "[1,2,3]"

    @Column(name = "base_price", precision = 10, scale = 2)
    private java.math.BigDecimal basePrice = java.math.BigDecimal.ZERO;

    @Column(name = "total_amount", precision = 10, scale = 2)
    private java.math.BigDecimal totalAmount = java.math.BigDecimal.ZERO;

    private LocalDateTime departureTime;

    @Enumerated(EnumType.STRING)
    private TicketStatus status = TicketStatus.WAITING;

    // Helper methods for seat numbers
    public java.util.List<Integer> getSeatNumbersList() {
        if (seatNumbers == null || seatNumbers.trim().isEmpty()) {
            return java.util.Collections.emptyList();
        }
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            return mapper.readValue(seatNumbers, 
                new com.fasterxml.jackson.core.type.TypeReference<java.util.List<Integer>>(){});
        } catch (Exception e) {
            return java.util.Collections.emptyList();
        }
    }

    public void setSeatNumbersList(java.util.List<Integer> seatNumbersList) {
        if (seatNumbersList == null || seatNumbersList.isEmpty()) {
            this.seatNumbers = null;
            return;
        }
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            this.seatNumbers = mapper.writeValueAsString(seatNumbersList);
        } catch (Exception e) {
            this.seatNumbers = null;
        }
    }

    // Calculate total amount based on base price and number of seats
    public void calculateTotalAmount() {
        if (basePrice != null && noOfSeats > 0) {
            this.totalAmount = basePrice.multiply(java.math.BigDecimal.valueOf(noOfSeats));
        }
    }
}