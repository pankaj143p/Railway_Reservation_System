package com.microservices.service.implementation;

import com.microservices.component.KafkaProducerService;
import com.microservices.component.Methods;
import com.microservices.domain.TicketStatus;
import com.microservices.dto.TicketBookedEvent;
import com.microservices.dto.TicketRequestDTO;
import com.microservices.dto.TicketResponseDTO;
import com.microservices.dto.TrainDTO;
import com.microservices.exception.TicketException;
import com.microservices.feign.PaymentClient;
import com.microservices.feign.TrainClient;
import com.microservices.model.TicketBooking;
import com.microservices.repository.TicketRepository;
import com.microservices.service.TicketService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TicketServiceImplementation implements TicketService {
    private static final Logger logger = LoggerFactory.getLogger(TicketServiceImplementation.class);

    private final TicketRepository ticketRepository;
    private final TrainClient trainClient;
    private final Methods methods;
    private final PaymentClient paymentClient;
    private final KafkaProducerService kafkaProducerService;

    @Override
    @Transactional
    public TicketResponseDTO bookTicket(Long train_id, @Valid TicketRequestDTO request) {
        String paymentId = request.getPaymentId();
        String razorpaySign = request.getRazorpaySignature();
        String orderId = request.getOrderId();

        // 1. Verify payment
        boolean isPaymentVerified = paymentClient.verifyPayment(orderId, paymentId, razorpaySign);
        if (!isPaymentVerified) {
            logger.warn("Payment verification failed for orderId: {}", orderId);
            throw new TicketException("Payment verification failed");
        }

        // 2. Prevent duplicate booking for same payment
        Optional<TicketBooking> existing = ticketRepository.findByOrderId(orderId);
        if (existing.isPresent()) {
            logger.warn("Duplicate booking attempt for orderId: {}", orderId);
            throw new TicketException("Ticket already booked for this payment/order.");
        }

        // 3. Fetch train details
        TrainDTO train = trainClient.getTrainById(train_id);

        // 4. Save ticket
        TicketBooking ticket = new TicketBooking();
        ticket.setAmount(request.getAmount());
        ticket.setFullName(request.getFullName());
        ticket.setAge(request.getAge());
        ticket.setEmail(request.getEmail());
        ticket.setBookingDate(LocalDateTime.now());
        ticket.setTicketNumber(methods.generateTicketNumber());
        ticket.setTrainId(train_id);
        ticket.setUserEmail(request.getUserEmail());
        ticket.setTrainName(train.getTrainName());
        ticket.setSource(train.getSource());
        ticket.setDestination(train.getDestination());
        ticket.setDepartureTime(LocalDateTime.now());
        ticket.setStatus(TicketStatus.CONFIRMED);
        ticket.setNoOfSeats(request.getSeatCount());
        ticket.setOrderId(orderId);

        ticketRepository.save(ticket);

        // 5. Update train seats
        trainClient.decreaseSeats(train_id, request.getSeatCount());

        // 6. Prepare response
        TicketResponseDTO response = new TicketResponseDTO();
        response.setFullName(ticket.getFullName());
        response.setAge(ticket.getAge());
        response.setEmail(ticket.getEmail());
        response.setTicket_number(ticket.getTicketNumber());
        response.setBooking_date(ticket.getBookingDate());
        response.setTrainDetails(train);

        try {
            TicketBookedEvent event = new TicketBookedEvent();
            event.setEmail(ticket.getEmail());
            event.setTicketNumber(ticket.getTicketNumber());
            event.setTrainName(ticket.getTrainName());
            event.setSource(ticket.getSource());
            event.setDestination(ticket.getDestination());
            event.setDepartureTime(String.valueOf(ticket.getDepartureTime()));
            event.setFullName(ticket.getFullName());
            event.setAge(ticket.getAge());
            event.setNoOfSeats(ticket.getNoOfSeats());
            event.setOrderId(ticket.getOrderId());

            kafkaProducerService.sendTicketBookedEvent(event);
        } catch (Exception e) {
            logger.error("Kafka send failed: {}", e.getMessage());
        }
        logger.info("Ticket booked successfully for orderId: {}", orderId);
        return response;
    }

    @Override
    public TicketBooking updateTicket(Long id, @Valid TicketBooking updatedTicket) {
        TicketBooking existing = ticketRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Ticket not found for update: {}", id);
                    return new TicketException("Ticket not found with id: " + id);
                });
        existing.setOrderId(updatedTicket.getOrderId());
        existing.setFullName(updatedTicket.getFullName());
        existing.setAge(updatedTicket.getAge());
        existing.setEmail(updatedTicket.getEmail());
        existing.setTicketNumber(updatedTicket.getTicketNumber());
        existing.setBookingDate(updatedTicket.getBookingDate());
        existing.setTrainId(updatedTicket.getTrainId());
        existing.setTrainName(updatedTicket.getTrainName());
        existing.setSource(updatedTicket.getSource());
        existing.setDestination(updatedTicket.getDestination());
        existing.setNoOfSeats(updatedTicket.getNoOfSeats());
        existing.setDepartureTime(updatedTicket.getDepartureTime());
        existing.setStatus(updatedTicket.getStatus());
        logger.info("Ticket updated: {}", id);
        return ticketRepository.save(existing);
    }

    @Override
    public String cancelTicket(Long ticketId) {
        Optional<TicketBooking> otp = ticketRepository.findById(ticketId);
        if(otp.isPresent()){
            TicketBooking ticket = otp.get();
            if(ticket.getStatus() == TicketStatus.CANCELLED) {
                logger.warn("Ticket already cancelled: {}", ticketId);
                return "Ticket "+ticket.getTicketNumber()+" already cancelled!";
            }
            if(ticket.getStatus() == TicketStatus.WAITING){
                logger.warn("Ticket is pending confirmation: {}", ticketId);
                return "Ticket "+ticket.getTicketNumber()+" is pending, Please confirm it";
            }
            trainClient.increaseSeats(ticket.getTrainId(), ticket.getNoOfSeats());
            ticket.setStatus(TicketStatus.CANCELLED);
            ticketRepository.save(ticket);
            logger.info("Ticket cancelled: {}", ticketId);
            return "Ticket with ticket number "+ticket.getTicketNumber()+" has been cancelled ";
        }
        logger.warn("Ticket not found for cancellation: {}", ticketId);
        throw new TicketException("Ticket not found");
    }

    @Override
    public TicketBooking getTicketDetails(Long ticket_id) {
        Optional<TicketBooking> otp = ticketRepository.findById(ticket_id);
        if(otp.isPresent()){
            logger.info("Fetched ticket details for id: {}", ticket_id);
            return otp.get();
        }
        logger.warn("Ticket not found: {}", ticket_id);
        throw new TicketException("Ticket with "+ticket_id+" not present!");
    }

    @Override
    public List<TicketBooking> getAllTickets() {
        logger.info("Fetching all tickets");
        return ticketRepository.findAll();
    }

    @Override
    public TicketBooking getTicketByOrderId(String orderId) {
        Optional<TicketBooking> otp = ticketRepository.findByOrderId(orderId);
        if(otp.isPresent()){
            logger.info("Fetched ticket by orderId: {}", orderId);
            return otp.get();
        }
        logger.warn("Ticket not found for orderId: {}", orderId);
        throw new TicketException("Ticket with order id "+orderId+" not present!");
    }

    @Override
    public List<TicketBooking> getTicketByUserEmail(String userEmail) {
        List<TicketBooking> tickets = ticketRepository.findByUserEmail(userEmail);
        if(tickets.isEmpty()) {
            logger.warn("No tickets found for user email: {}", userEmail);
            throw new TicketException("No tickets found for user with email: " + userEmail);
        }
        logger.info("Fetched tickets for user email: {}", userEmail);
        return tickets;
    }

}