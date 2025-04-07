package com.microservices.dto;

import lombok.Data;

@Data
public class TrainDTO {
    private Long id;
    private String name;
    private String source;
    private String destination;
    private int totalSeats;
}
