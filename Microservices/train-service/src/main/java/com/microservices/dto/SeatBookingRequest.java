package com.microservices.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatBookingRequest {
    
    @NotNull(message = "Train ID is required")
    private Long trainId;

    @NotBlank(message = "Seat class is required")
    @Pattern(regexp = "^(SLEEPER|AC2|AC1)$", message = "Seat class must be SLEEPER, AC2, or AC1")
    private String seatClass;

    @NotNull(message = "Booking date is required")
    @Future(message = "Booking date must be in the future")
    private LocalDate bookingDate;

    @NotBlank(message = "Passenger name is required")
    @Size(max = 100, message = "Passenger name must not exceed 100 characters")
    private String passengerName;

    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String passengerEmail;

    @Pattern(regexp = "^[0-9+\\-\\s()]*$", message = "Invalid phone number format")
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String passengerPhone;

    // Optional - if not provided, system will auto-assign
    @Min(value = 1, message = "Seat number must be at least 1")
    private Integer preferredSeatNumber;

    @NotNull(message = "Number of seats is required")
    @Min(value = 1, message = "Number of seats must be at least 1")
    @Max(value = 6, message = "Maximum 6 seats can be booked at once")
    private Integer numberOfSeats = 1;
}
