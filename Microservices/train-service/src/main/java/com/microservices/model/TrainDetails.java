package com.microservices.model;

import com.microservices.domain.TrainStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "train_details")
public class TrainDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Changed from AUTO to IDENTITY
    @Column(name = "train_id")
    private Long trainId;

    @NotBlank(message = "Train name is required")
    @Column(name = "train_name", nullable = false)
    private String trainName;

    @NotBlank(message = "Source is required")
    @Column(name = "source", nullable = false)
    private String source;

    @NotBlank(message = "Destination is required")
    @Column(name = "destination", nullable = false)
    private String destination;

    @Min(value = 1, message = "Total seats must be at least 1")
    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats; // Changed from int to Integer

    @ElementCollection
    @CollectionTable(name = "train_routes", joinColumns = @JoinColumn(name = "train_id"))
    @Column(name = "route")
    @NotEmpty(message = "Routes cannot be empty")
    private List<@NotBlank(message = "Route cannot be blank") String> routes;

    @ElementCollection
    @CollectionTable(name = "train_inactive_dates", joinColumns = @JoinColumn(name = "train_id"))
    @Column(name = "inactive_date")
    private List<LocalDate> inactiveDates;

    @NotNull(message = "Departure time is required")
    @Column(name = "departure_time", nullable = false)
    private LocalTime departureTime;

    @NotNull(message = "Arrival time is required")
    @Column(name = "arrival_time", nullable = false)
    private LocalTime arrivalTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TrainStatus status = TrainStatus.ON_TIME; // Default value

    @NotNull(message = "Amount is required")
    @Min(value = 0, message = "Amount must be non-negative")
    @Column(name = "amount", nullable = false)
    private BigDecimal amount; // Changed from Integer to BigDecimal for currency

    @NotNull(message = "Date is required")
    @FutureOrPresent(message = "Date must be today or in the future")
    @Column(name = "date", nullable = false)
    private LocalDate date;

    // New fields for admin management
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "operational_status", length = 50)
    private String operationalStatus = "OPERATIONAL";

    @Column(name = "maintenance_notes", length = 500)
    private String maintenanceNotes;

    // Custom setter methods
    public void setRoutes(List<String> routes) {
        this.routes = routes;
    }

    public void setInactiveDates(List<LocalDate> inactiveDates) {
        this.inactiveDates = inactiveDates;
    }
    
    // Keep the old method name for backward compatibility
    public void setInactiveDays(List<LocalDate> inactiveDates) {
        this.inactiveDates = inactiveDates;
    }
}