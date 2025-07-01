package com.microservices.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TicketRequestDTO {
    private Long trainId;
    private String fullName;
    private Integer seatCount;
    private int age;
    private String email;
    private LocalDateTime date;
    private String paymentId;
    private String razorpaySignature;
    private String orderId;
}
