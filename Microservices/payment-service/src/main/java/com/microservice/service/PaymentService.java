package com.microservice.service;

public interface PaymentService {
    String createOrder(int amount) throws Exception;
    boolean verifyPayment(String orderId, String paymentId, String razorpaySign);
     String refundPayment(String paymentId, int refundAmount);
}