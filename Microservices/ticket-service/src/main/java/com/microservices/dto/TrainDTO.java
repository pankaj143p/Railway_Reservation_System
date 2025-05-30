package com.microservices.dto;
import lombok.Data;
import java.time.LocalTime;


@Data
public class TrainDTO {
    private String trainName;

    private String source;

    private String destination;

    private LocalTime departureTime;

    private LocalTime arrivalTime;

    private int noOfSeats;
}
