package com.microservices.dto;

import com.microservices.domain.TrainStatus;
import lombok.Data;

@Data
public class TrainDTO {
    private Long id;
    private String name;
    private String source;
    private String destination;
    private int totalSeats;
    private TrainStatus status;
}
