package com.microservices.model;

import com.microservices.domain.TrainStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
@Data
@Entity
public class TrainDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long trainId;

    @NotBlank(message = "Train name is required")
    @Column(nullable = false)
    private String trainName;

    @NotBlank(message = "Source is required")
    @Column(nullable = false)
    private String source;

    @NotBlank(message = "Destination is required")
    @Column(nullable = false)
    private String destination;

    @Min(value = 1, message = "Total seats must be at least 1")
    @Column(nullable = false)
    private int totalSeats;

    @ElementCollection
    @NotEmpty(message = "Routes cannot be empty")
    private List<@NotBlank(message = "Route cannot be blank") String> routes;

    @NotNull(message = "Departure time is required")
    @Column(nullable = false)
    private LocalTime departureTime;

    @NotNull(message = "Arrival time is required")
    @Column(nullable = false)
    private LocalTime arrivalTime;

    @NotNull(message = "Status is required")
    @Column(nullable = false)
    private TrainStatus status;
    
    @NotNull(message = "Amount is required")
    @Min(value = 0, message = "Amount must be non-negative")
    @Column(nullable = false)
    private Integer amount;

    @NotNull(message = "Date is required")
    @FutureOrPresent(message = "Date must be today or in the future")
    @Column(nullable = false)
    private LocalDate date;

    // Setter for routes (for validation)
    public void setRoutes(List<String> routes2) {
        this.routes = routes2;
    }
}