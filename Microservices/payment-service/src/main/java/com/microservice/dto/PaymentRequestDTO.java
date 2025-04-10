package com.microservice.dto;

import lombok.Data;

@Data
public class PaymentRequestDTO {
    private int amount;
    private String currency;
    private String receipt;
}
