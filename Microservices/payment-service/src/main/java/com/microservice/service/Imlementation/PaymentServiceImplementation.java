package com.microservice.service.Imlementation;

import com.microservice.config.RazorpayConfig;
import com.microservice.dto.PaymentRequestDTO;
import com.microservice.service.PaymentService;
import com.microservice.util.Utils;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.AllArgsConstructor;
import lombok.Value;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PaymentServiceImplementation implements PaymentService {
    private final RazorpayClient razorpayClient;
    private final RazorpayConfig razorpayConfig;

    @Override
    public String createOrder(int amount) throws RazorpayException {
        JSONObject orderReq = new JSONObject();
        orderReq.put("amount", amount);
        orderReq.put("currency", "INR");
        orderReq.put("payment_capture",1);
        Order order = razorpayClient.orders.create(orderReq);
        return order.get("id");

    }

    @Override
    public boolean verifyPayment(String orderId, String paymentId, String razorpaySign) {
        String payload = orderId + '|' + paymentId;
        try {
           return Utils.verifySign(payload, razorpaySign, razorpayConfig.getSecret());
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

}
