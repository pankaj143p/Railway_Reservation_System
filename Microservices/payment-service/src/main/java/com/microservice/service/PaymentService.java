package com.microservice.service;


import com.microservice.dto.PaymentRequestDTO;

public interface PaymentService {
    public String createOrder(PaymentRequestDTO req) throws Exception;
}

