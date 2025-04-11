package com.microservice.service.Imlementation;

import com.microservice.dto.PaymentRequestDTO;
import com.microservice.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.Value;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImplementation implements PaymentService {
//    @Value("${razorpay.key_id}")
//    private String keyId;
//
//    @Value("${razorpay.key_secret}")
//    private String keySecret;
    @Autowired
    private RazorpayClient razorpayClient;
    @Override
    public String createOrder(int amount) throws RazorpayException {
        JSONObject orderReq = new JSONObject();
        orderReq.put("amount", amount);
        orderReq.put("currency", "INR");
        orderReq.put("payment_capture",1);
        Order order = razorpayClient.orders.create(orderReq);
        return order.toString();

    }
}
