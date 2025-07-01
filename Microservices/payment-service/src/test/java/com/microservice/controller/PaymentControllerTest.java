package com.microservice.controller;

import com.microservice.service.PaymentService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PaymentController.class)
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PaymentService paymentService;

    @Test
    void createOrder_success() throws Exception {
        Mockito.when(paymentService.createOrder(500)).thenReturn("order_123");
        mockMvc.perform(post("/createOrder?amount=500"))
                .andExpect(status().isOk())
                .andExpect(content().string("order_123"));
    }

    @Test
    void createOrder_failure() throws Exception {
        Mockito.when(paymentService.createOrder(500)).thenThrow(new com.microservice.exception.PaymentException("fail"));
        mockMvc.perform(post("/createOrder?amount=500"))
                .andExpect(status().isOk())
                .andExpect(content().string("fail"));
    }

    @Test
    void verifyPayment_success() throws Exception {
        Mockito.when(paymentService.verifyPayment(anyString(), anyString(), anyString())).thenReturn(true);
        mockMvc.perform(post("/verify?orderId=order_123&paymentId=pay_abc&razorpaySign=sig"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void verifyPayment_failure() throws Exception {
        Mockito.when(paymentService.verifyPayment(anyString(), anyString(), anyString())).thenThrow(new com.microservice.exception.PaymentException("fail"));
        mockMvc.perform(post("/verify?orderId=order_123&paymentId=pay_abc&razorpaySign=sig"))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));
    }
}

