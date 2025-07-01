package com.microservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @NotBlank(message = "Order ID is required")
    // @Column(unique = true, nullable = false)
    private String orderId;

    private String paymentId;

    @Min(value = 1, message = "Amount must be positive")
    private int amount;

    // @NotBlank(message = "Status is required")
    private String status;

    private LocalDateTime createdAt = LocalDateTime.now();
}