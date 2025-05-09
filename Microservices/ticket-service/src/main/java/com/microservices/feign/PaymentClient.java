package com.microservices.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "payment-service", url = "http://localhost:5110")
public interface PaymentClient {

    @GetMapping("/createOrder")
    String createOrder(@RequestParam("amount") int amount);

    @PostMapping("/verify")
    boolean verifyPayment(@RequestParam("orderId") String orderId, @RequestParam("paymentId") String paymentId, String razorpaySign);
}
