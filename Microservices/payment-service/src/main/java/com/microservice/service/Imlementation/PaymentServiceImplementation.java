package com.microservice.service.Imlementation;

import com.microservice.dto.PaymentRequestDTO;
import com.microservice.service.PaymentService;
import lombok.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImplementation implements PaymentService {
    @Value("${razorpay.key_id}")
    private String keyId;

    @Value("${razorpay.key_secret}")
    private String keySecret;

    @Override
    public String createOrder(PaymentRequestDTO req) {

    }
}
