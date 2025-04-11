package com.microservice.controller;

import com.microservice.service.PaymentService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;
    @GetMapping("/createOrder")
    public String createOrder(@RequestParam int amount){
        try {
            return paymentService.createOrder(amount);
        }
        catch (Exception e){
            return e.getMessage();
        }
    }
    @PostMapping("/verify")
    public ResponseEntity verifyPayment(@RequestParam String orderId, @RequestParam String paymentId, String razorpaySign){
        try{
            boolean isValid = paymentService.verifyPayment(orderId, paymentId, razorpaySign);
            return (isValid) ? ResponseEntity.ok("Payment verify SuccessFully") : ResponseEntity.status(400).body("Payment verification failed");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error while payment verify");
        }
    }

}
