package com.microservice.repository;

import com.microservice.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByOrderId(String orderId);

    Payment findByPaymentId(String paymentId);
}