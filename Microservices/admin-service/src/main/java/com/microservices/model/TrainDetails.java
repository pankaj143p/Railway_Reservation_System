package com.microservices.model;

import com.microservices.domain.TrainStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
@Data
@Entity
@Table(name = "train_details")
public class TrainDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long trainId;

    @Column(nullable = false)
    private String trainName;

    @Column(nullable = false)
    private String source;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private int totalSeats;

    @ElementCollection
    private List<String>routes;

    @Column(nullable = false)
    private LocalTime departureTime;

    @Column(nullable = false)
    private LocalTime arrivalTime;

    @Column(nullable = false)
    private TrainStatus status;

    @Column(nullable = false)
    private Integer amount;

    @Column(name="noOfSeats")
    private Integer noOfSeats;

    @Column
    private LocalDate date;

    // New fields for admin management
    @Column(nullable = false, columnDefinition = "boolean default true")
    private Boolean isActive = true;

    @Column(length = 50)
    private String operationalStatus = "OPERATIONAL";

    @Column(length = 500)
    private String maintenanceNotes;


}
