package com.microservices.dto;

import lombok.Data;

import java.time.LocalDate;


@Data
public class TicketRequestDTO {
    private String userEmail;
    private Long trainId;
    private String fullName;
    private Integer seatCount;
    private int age;
    private String email;
    private LocalDate date;
    private String paymentId;
    private String razorpaySignature;
    private String orderId;
    private int amount;
}
