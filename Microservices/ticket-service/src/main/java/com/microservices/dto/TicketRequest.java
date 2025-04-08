package com.microservices.dto;

import lombok.Data;

@Data
public class TicketRequest {
    private Long trainId;
    private String fullName;
    private int seatCount;
}
