// package com.microservice.service;
// import com.microservice.config.RazorpayConfig;
// import com.microservice.exception.PaymentException;
// import com.microservice.model.Payment;
// import com.microservice.repository.PaymentRepository;
// import com.microservice.service.Imlementation.PaymentServiceImplementation;
// import com.razorpay.Order;
// import com.razorpay.RazorpayClient;
// import org.json.JSONObject;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.*;
// import static org.junit.jupiter.api.Assertions.*;
// import static org.mockito.Mockito.*;

// class PaymentServiceTest {

//     @Mock private RazorpayClient razorpayClient;
//     @Mock private RazorpayConfig razorpayConfig;
//     @Mock private PaymentRepository paymentRepository;

//     @InjectMocks private PaymentServiceImplementation paymentService;

//     @BeforeEach
//     void setUp() {
//         MockitoAnnotations.openMocks(this);
//     }

//     @Test
//     void createOrder_success() throws Exception {
//         Order order = mock(Order.class);
//         when(order.get("id")).thenReturn("order_123");
//         when(razorpayClient.orders.create(any(JSONObject.class))).thenReturn(order);

//         String orderId = paymentService.createOrder(500);

//         assertEquals("order_123", orderId);
//         verify(paymentRepository, times(1)).save(any(Payment.class));
//     }

//     @Test
//     void createOrder_failure() throws Exception {
//         when(razorpayClient.orders.create(any(JSONObject.class))).thenThrow(new com.razorpay.RazorpayException("fail"));
//         assertThrows(PaymentException.class, () -> paymentService.createOrder(500));
//     }

//     @Test
//     void verifyPayment_success() {
//         Payment payment = new Payment();
//         payment.setOrderId("order_123");
//         when(paymentRepository.findByOrderId("order_123")).thenReturn(payment);
//         when(razorpayConfig.getSecret()).thenReturn("secret");
//         // Assume Utils.verifySign returns true
//         mockStatic(com.microservice.util.Utils.class).when(() -> com.microservice.util.Utils.verifySign(anyString(), anyString(), anyString())).thenReturn(true);

//         boolean result = paymentService.verifyPayment("order_123", "pay_abc", "sig");

//         assertTrue(result);
//         verify(paymentRepository, times(1)).save(any(Payment.class));
//     }
// }