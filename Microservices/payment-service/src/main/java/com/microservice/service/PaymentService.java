package com.microservice.service;


import com.microservice.dto.PaymentRequestDTO;

public interface PaymentService {
    public String createOrder(int amount) throws Exception;
}

