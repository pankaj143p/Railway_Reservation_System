package com.microservices.service;
import com.microservices.component.KafkaProducerService;
import com.microservices.component.Methods;
import com.microservices.domain.TicketStatus;
import com.microservices.dto.TicketBookedEvent;
import com.microservices.dto.TicketRequestDTO;
import com.microservices.dto.TicketResponseDTO;
import com.microservices.dto.TrainDTO;
import com.microservices.feign.PaymentClient;
import com.microservices.feign.TrainClient;
import com.microservices.model.TicketBooking;
import com.microservices.repository.TicketRepository;
import com.microservices.service.implementation.TicketServiceImplementation;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TicketServiceImplementationTest {

    @Mock
    private TicketRepository ticketRepository;
    @Mock
    private TrainClient trainClient;
    @Mock
    private Methods methods;
    @Mock
    private PaymentClient paymentClient;
    @Mock
    private KafkaProducerService kafkaProducerService;

    @InjectMocks
    private TicketServiceImplementation ticketService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // --- bookTicket ---
    @Test
    void bookTicket_success() {
        Long trainId = 1L;
        TicketRequestDTO req = new TicketRequestDTO();
        req.setPaymentId("pay123");
        req.setRazorpaySignature("sig");
        req.setOrderId("order123");
        req.setFullName("Amit Sharma");
        req.setAge(25);
        req.setEmail("amit@gmail.com");
        req.setUserEmail("amit@gmail.com");
        req.setSeatCount(2);

        when(paymentClient.verifyPayment("order123", "pay123", "sig")).thenReturn(true);
        when(ticketRepository.findByOrderId("order123")).thenReturn(Optional.empty());
        TrainDTO train = new TrainDTO();
        train.setTrainName("Rajdhani");
        train.setSource("Delhi");
        train.setDestination("Mumbai");
        when(trainClient.getTrainById(trainId)).thenReturn(train);
        when(methods.generateTicketNumber()).thenReturn("TICKET123");
        when(ticketRepository.save(any(TicketBooking.class))).thenAnswer(i -> i.getArgument(0));

        TicketResponseDTO res = ticketService.bookTicket(trainId, req);

        assertEquals("Amit Sharma", res.getFullName());
        assertEquals("TICKET123", res.getTicket_number());
        assertEquals(train, res.getTrainDetails());
        verify(trainClient).decreaseSeats(trainId, 2);
        verify(kafkaProducerService).sendTicketBookedEvent(any(TicketBookedEvent.class));
    }

    @Test
    void bookTicket_paymentVerificationFails_throwsException() {
        TicketRequestDTO req = new TicketRequestDTO();
        req.setPaymentId("pay123");
        req.setRazorpaySignature("sig");
        req.setOrderId("order123");

        when(paymentClient.verifyPayment("order123", "pay123", "sig")).thenReturn(false);

        assertThrows(RuntimeException.class, () -> ticketService.bookTicket(1L, req));
    }

    @Test
    void bookTicket_duplicateOrder_throwsException() {
        TicketRequestDTO req = new TicketRequestDTO();
        req.setPaymentId("pay123");
        req.setRazorpaySignature("sig");
        req.setOrderId("order123");

        when(paymentClient.verifyPayment(any(), any(), any())).thenReturn(true);
        when(ticketRepository.findByOrderId("order123")).thenReturn(Optional.of(new TicketBooking()));

        assertThrows(RuntimeException.class, () -> ticketService.bookTicket(1L, req));
    }

    // --- updateTicket ---
    @Test
    void updateTicket_success() {
        TicketBooking existing = new TicketBooking();
        existing.setTicket_id(1L);
        TicketBooking update = new TicketBooking();
        update.setOrderId("order123");
        update.setFullName("Priya Singh");
        update.setAge(30);
        update.setEmail("priya@gmail.com");
        update.setTicketNumber("TICKET456");
        // update.setBookingDate("2023-03-01);
        update.setTrainId(2L);
        update.setTrainName("Shatabdi");
        update.setSource("Delhi");
        update.setDestination("Chennai");
        update.setNoOfSeats(3);
        update.setDepartureTime(LocalDateTime.now());
        update.setStatus(TicketStatus.CONFIRMED);

        when(ticketRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(ticketRepository.save(any(TicketBooking.class))).thenAnswer(i -> i.getArgument(0));

        TicketBooking result = ticketService.updateTicket(1L, update);

        assertEquals("Priya Singh", result.getFullName());
        assertEquals("TICKET456", result.getTicketNumber());
        assertEquals(TicketStatus.CONFIRMED, result.getStatus());
    }

    @Test
    void updateTicket_notFound_throwsException() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> ticketService.updateTicket(1L, new TicketBooking()));
    }

    // --- cancelTicket ---
    @Test
    void cancelTicket_success() {
        TicketBooking ticket = new TicketBooking();
        ticket.setTicket_id(1L);
        ticket.setTicketNumber("TICKET123");
        ticket.setStatus(TicketStatus.CONFIRMED);
        ticket.setTrainId(2L);
        ticket.setNoOfSeats(2);

        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(any(TicketBooking.class))).thenAnswer(i -> i.getArgument(0));

        String result = ticketService.cancelTicket(1L);

        assertEquals("Ticket with ticket number TICKET123 has been cancelled ", result);
        assertEquals(TicketStatus.CANCELLED, ticket.getStatus());
        verify(trainClient).increaseSeats(2L, 2);
    }

    @Test
    void cancelTicket_alreadyCancelled() {
        TicketBooking ticket = new TicketBooking();
        ticket.setTicket_id(1L);
        ticket.setTicketNumber("TICKET123");
        ticket.setStatus(TicketStatus.CANCELLED);

        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));

        String result = ticketService.cancelTicket(1L);
        assertTrue(result.contains("already cancelled"));
    }

    @Test
    void cancelTicket_waitingStatus() {
        TicketBooking ticket = new TicketBooking();
        ticket.setTicket_id(1L);
        ticket.setTicketNumber("TICKET123");
        ticket.setStatus(TicketStatus.WAITING);

        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));

        String result = ticketService.cancelTicket(1L);
        assertTrue(result.contains("pending"));
    }

    @Test
    void cancelTicket_notFound_throwsException() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> ticketService.cancelTicket(1L));
    }

    // --- getTicketDetails ---
    @Test
    void getTicketDetails_success() {
        TicketBooking ticket = new TicketBooking();
        ticket.setTicket_id(1L);
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));

        TicketBooking result = ticketService.getTicketDetails(1L);
        assertEquals(1L, result.getTicket_id());
    }

    @Test
    void getTicketDetails_notFound_throwsException() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> ticketService.getTicketDetails(1L));
    }

    // --- getAllTickets ---
    @Test
    void getAllTickets_returnsList() {
        TicketBooking t1 = new TicketBooking();
        t1.setTicket_id(1L);
        TicketBooking t2 = new TicketBooking();
        t2.setTicket_id(2L);
        when(ticketRepository.findAll()).thenReturn(List.of(t1, t2));

        List<TicketBooking> result = ticketService.getAllTickets();
        assertEquals(2, result.size());
    }

    // --- getTicketByOrderId ---
    @Test
    void getTicketByOrderId_success() {
        TicketBooking ticket = new TicketBooking();
        ticket.setOrderId("order123");
        when(ticketRepository.findByOrderId("order123")).thenReturn(Optional.of(ticket));

        TicketBooking result = ticketService.getTicketByOrderId("order123");
        assertEquals("order123", result.getOrderId());
    }

    @Test
    void getTicketByOrderId_notFound_throwsException() {
        when(ticketRepository.findByOrderId("order123")).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> ticketService.getTicketByOrderId("order123"));
    }

    // --- getTicketByUserEmail ---
    @Test
    void getTicketByUserEmail_success() {
        TicketBooking t1 = new TicketBooking();
        t1.setUserEmail("amit@gmail.com");
        when(ticketRepository.findByUserEmail("amit@gmail.com")).thenReturn(List.of(t1));

        List<TicketBooking> result = ticketService.getTicketByUserEmail("amit@gmail.com");
        assertEquals(1, result.size());
        assertEquals("amit@gmail.com", result.get(0).getUserEmail());
    }

    @Test
    void getTicketByUserEmail_notFound_throwsException() {
        when(ticketRepository.findByUserEmail("amit@gmail.com")).thenReturn(Collections.emptyList());
        assertThrows(RuntimeException.class, () -> ticketService.getTicketByUserEmail("amit@gmail.com"));
    }
}