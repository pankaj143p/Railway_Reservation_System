package com.microservices.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalTime;
import java.util.List;
@Data
@Entity
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
}
