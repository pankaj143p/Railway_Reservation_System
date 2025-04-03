package com.microservices.model;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Data;
import org.springframework.data.annotation.Id;
import java.time.LocalTime;
import java.util.List;
@Data
public class TrainModel {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String trainId;

    @Column(nullable = false)
    private String tainName;

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
