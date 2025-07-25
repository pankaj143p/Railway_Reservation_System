package com.microservices.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "payment-service", url = "http://localhost:5111")
public interface PaymentClient {

    @PostMapping("/createOrder")
    String createOrder(@RequestParam("amount") int amount);

    @PostMapping("/verify")
    boolean verifyPayment(@RequestParam("orderId") String orderId, @RequestParam("paymentId") String paymentId, @RequestParam("razorpaySign") String razorpaySign);
    
    @PostMapping("/refund")
    String refundPayment(@RequestParam("paymentId") String paymentId, @RequestParam("amount") int amount);
}
