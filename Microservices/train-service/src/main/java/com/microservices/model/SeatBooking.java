package com.microservices.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "seat_bookings", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"train_id", "seat_number", "seat_class", "booking_date"}))
public class SeatBooking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Train ID is required")
    @Column(name = "train_id", nullable = false)
    private Long trainId;

    @NotNull(message = "Seat number is required")
    @Min(value = 1, message = "Seat number must be at least 1")
    @Column(name = "seat_number", nullable = false)
    private Integer seatNumber;

    @NotBlank(message = "Seat class is required")
    @Pattern(regexp = "^(SLEEPER|AC2|AC1)$", message = "Seat class must be SLEEPER, AC2, or AC1")
    @Column(name = "seat_class", nullable = false)
    private String seatClass;

    @NotNull(message = "Booking date is required")
    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    @NotBlank(message = "Passenger name is required")
    @Size(max = 100, message = "Passenger name must not exceed 100 characters")
    @Column(name = "passenger_name", nullable = false)
    private String passengerName;

    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    @Column(name = "passenger_email")
    private String passengerEmail;

    @Pattern(regexp = "^[0-9+\\-\\s()]*$", message = "Invalid phone number format")
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    @Column(name = "passenger_phone")
    private String passengerPhone;

    @Column(name = "ticket_id")
    private Long ticketId;

    @NotBlank(message = "Booking status is required")
    @Pattern(regexp = "^(CONFIRMED|CANCELLED|WAITING)$", message = "Booking status must be CONFIRMED, CANCELLED, or WAITING")
    @Column(name = "booking_status", nullable = false)
    private String bookingStatus = "CONFIRMED";

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Helper methods
    public boolean isConfirmed() {
        return "CONFIRMED".equals(bookingStatus);
    }

    public boolean isCancelled() {
        return "CANCELLED".equals(bookingStatus);
    }

    public boolean isWaiting() {
        return "WAITING".equals(bookingStatus);
    }
}
