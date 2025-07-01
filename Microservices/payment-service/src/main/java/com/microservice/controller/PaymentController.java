package com.microservice.controller;

import com.microservice.exception.PaymentException;
import com.microservice.service.PaymentService;
import jakarta.validation.constraints.Min;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class PaymentController {
    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/createOrder")
    public String createOrder(@RequestParam @Min(1) int amount) throws Exception {
        try {
            String orderId = paymentService.createOrder(amount);
            logger.info("Order created: {}", orderId);
            return orderId;
        } catch (PaymentException e) {
            logger.error("Order creation failed: {}", e.getMessage());
            throw new Exception(e.getMessage());
        }
    }

    @PostMapping("/verify")
    public boolean verifyPayment(@RequestParam String orderId, @RequestParam String paymentId, @RequestParam String razorpaySign) {
        try {
            boolean result = paymentService.verifyPayment(orderId, paymentId, razorpaySign);
            logger.info("Payment verification for order {}: {}", orderId, result ? "SUCCESS" : "FAILED");
            return result;
        } catch (PaymentException e) {
            logger.error("Payment verification failed: {}", e.getMessage());
            return false;
        }
    }
    @PostMapping("/refund")
    public String refundPayment(@RequestParam String paymentId, @RequestParam int amount) { 
    try {
        // amount should be in paise (e.g., ₹100 = 10000 paise)
        String refundId = paymentService.refundPayment(paymentId, amount);
        logger.info("Refund initiated: {}", refundId);
        return refundId;
    } catch (PaymentException e) {
        logger.error("Refund failed: {}", e.getMessage());
        throw new RuntimeException(e.getMessage());
    }
  }
}

