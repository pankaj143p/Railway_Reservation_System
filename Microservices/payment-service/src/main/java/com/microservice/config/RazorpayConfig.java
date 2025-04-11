package com.microservice.config;

import com.razorpay.RazorpayClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RazorpayConfig {
    @Value("${razorpay.key_id}")
    private String keyId;

    @Value("${razorpay.key_secret}")
    private String keySecret;

    public String getSecret() {
        return keySecret;
    }
    @Bean
    public RazorpayClient razorpayClient () throws Exception{
        return new RazorpayClient(keyId, keySecret);
    }
}
