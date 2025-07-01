package com.microservice.service.Imlementation;

import com.microservice.config.RazorpayConfig;
import com.microservice.exception.PaymentException;
import com.microservice.model.Payment;
import com.microservice.repository.PaymentRepository;
import com.microservice.service.PaymentService;
import com.microservice.util.Utils;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Refund;

import jakarta.validation.constraints.Min;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImplementation implements PaymentService {
    private static final Logger logger = LoggerFactory.getLogger(PaymentServiceImplementation.class);

    @Autowired
    private RazorpayClient razorpayClient;
    @Autowired
    private RazorpayConfig razorpayConfig;
    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public String createOrder(@Min(1) int amount) {
        try {
            JSONObject orderReq = new JSONObject();
            orderReq.put("amount", amount);
            orderReq.put("currency", "INR");
            orderReq.put("payment_capture", 1);
            Order order = razorpayClient.orders.create(orderReq);

            // Save order to DB
            Payment payment = new Payment();
            Object orderIdObj = order.get("id");
            String orderId = (orderIdObj != null) ? orderIdObj.toString() : "";
            payment.setOrderId(orderId);
            payment.setAmount(amount/100);
            payment.setStatus("CREATED");
            paymentRepository.save(payment);

            logger.info("Order created with id: {}", orderId);
            return orderId;
        } catch (RazorpayException e) {
            logger.error("Razorpay order creation failed: {}", e.getMessage());
            throw new PaymentException("Failed to create order: " + e.getMessage());
        }
    }

    @Override
    public boolean verifyPayment(String orderId, String paymentId, String razorpaySign) {
        String payload = orderId + '|' + paymentId;
        try {
            boolean valid = Utils.verifySign(payload, razorpaySign, razorpayConfig.getSecret());
            Payment payment = paymentRepository.findByOrderId(orderId);
            if (payment != null) {
                payment.setPaymentId(paymentId);
                payment.setStatus(valid ? "SUCCESS" : "FAILED");
                paymentRepository.save(payment);
            }
            logger.info("Payment verification for order {}: {}", orderId, valid ? "SUCCESS" : "FAILED");
            return valid;
        } catch (Exception e) {
            logger.error("Payment verification failed: {}", e.getMessage());
            throw new PaymentException("Payment verification failed: " + e.getMessage());
        }
    }

    @Override
    public String refundPayment(String paymentId, int refundAmount) {
    try {
        JSONObject refundRequest = new JSONObject();
        refundRequest.put("amount", refundAmount); // in paise
        Refund refund = razorpayClient.payments.refund(paymentId, refundRequest);

        // Optionally update payment status in DB
        Payment payment = paymentRepository.findByPaymentId(paymentId);
        if (payment != null) {
            payment.setStatus("REFUNDED");
            paymentRepository.save(payment);
        }

        logger.info("Refund processed for paymentId {}: refundId={}", paymentId, refund.get("id"));
        return refund.get("id");
    } catch (RazorpayException e) {
        logger.error("Refund failed: {}", e.getMessage());
        throw new PaymentException("Refund failed: " + e.getMessage());
    }
}
}