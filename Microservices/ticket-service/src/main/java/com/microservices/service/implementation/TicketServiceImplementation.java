package com.microservices.service.implementation;

import com.microservices.component.KafkaProducerService;
import com.microservices.component.Methods;
import com.microservices.domain.TicketStatus;
import com.microservices.dto.CancellationResponseDTO;
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

import java.time.LocalDate;
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

        // 4. Book the ticket
        TicketBooking ticket = new TicketBooking();
        ticket.setAmount(request.getAmount());
        ticket.setFullName(request.getFullName());
        ticket.setAge(request.getAge());
        ticket.setEmail(request.getEmail());
        ticket.setBookingDate(request.getDate());
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
        ticket.setPaymentId(paymentId); // Store payment ID for refunds

        ticketRepository.save(ticket);

        // 5. Update train seats
        // trainClient.decreaseSeats(train_id, request.getSeatCount());

        // 6. Prepare response
        TicketResponseDTO response = new TicketResponseDTO();
        response.setFullName(ticket.getFullName());
        response.setAge(ticket.getAge());
        response.setEmail(ticket.getEmail());
        response.setTicket_number(ticket.getTicketNumber());
        response.setBooking_date(ticket.getBookingDate());
        response.setTrainDetails(train);

        try {
            // 7. Send Kafka event
            logger.info("Sending Kafka event for ticket booking: {}", ticket.getTicketNumber());
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

    
    // 8. Update ticket details
    // This method allows updating ticket details like full name, age, etc.
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

            // Process refund if payment ID exists
            String refundMessage = "";
            if (ticket.getPaymentId() != null && !ticket.getPaymentId().isEmpty()) {
                try {
                    // Calculate refund amount (in paise - Razorpay uses paise)
                    int refundAmount = ticket.getAmount() * 100;
                    
                    // Call payment service to process refund
                    String refundId = paymentClient.refundPayment(ticket.getPaymentId(), refundAmount);
                    logger.info("Refund processed for ticket {}: refundId={}", ticketId, refundId);
                    refundMessage = " Refund of ₹" + ticket.getAmount() + " has been initiated and will be processed within 5-7 business days.";
                } catch (Exception e) {
                    logger.error("Refund failed for ticket {}: {}", ticketId, e.getMessage());
                    refundMessage = " Refund processing failed. Please contact support.";
                }
            }

            // Update ticket status and increase train seats
            // trainClient.increaseSeats(ticket.getTrainId(), ticket.getNoOfSeats());
            ticket.setStatus(TicketStatus.CANCELLED);
            ticketRepository.save(ticket);
            logger.info("Ticket cancelled: {}", ticketId);
            
            return "Ticket with ticket number "+ticket.getTicketNumber()+" has been cancelled." + refundMessage;
        }
        logger.warn("Ticket not found for cancellation: {}", ticketId);
        throw new TicketException("Ticket not found");
    }

    @Override
    public CancellationResponseDTO cancelTicketWithRefund(Long ticketId) {
        Optional<TicketBooking> otp = ticketRepository.findById(ticketId);
        if(!otp.isPresent()){
            logger.warn("Ticket not found for cancellation: {}", ticketId);
            throw new TicketException("Ticket not found");
        }

        TicketBooking ticket = otp.get();
        
        if(ticket.getStatus() == TicketStatus.CANCELLED) {
            logger.warn("Ticket already cancelled: {}", ticketId);
            return new CancellationResponseDTO("Ticket "+ticket.getTicketNumber()+" already cancelled!");
        }
        
        if(ticket.getStatus() == TicketStatus.WAITING){
            logger.warn("Ticket is pending confirmation: {}", ticketId);
            return new CancellationResponseDTO("Ticket "+ticket.getTicketNumber()+" is pending, Please confirm it");
        }

        // Process refund if payment ID exists
        boolean refundProcessed = false;
        String refundId = null;
        double refundAmount = 0.0;
        String refundStatus = "NOT_APPLICABLE";
        String expectedRefundTime = "N/A";

        if (ticket.getPaymentId() != null && !ticket.getPaymentId().isEmpty()) {
            try {
                // Calculate refund amount with 20% cancellation fee (user gets 80%)
                double cancellationFeeRate = 0.20; // 20% cancellation fee
                double refundRate = 0.80; // 80% refund to user
                
                double originalAmount = ticket.getAmount();
                refundAmount = originalAmount * refundRate; // 80% of original amount
                double cancellationFee = originalAmount * cancellationFeeRate; // 20% kept as fee
                
                // Convert to paise for Razorpay (multiply by 100)
                int refundAmountPaise = (int) (refundAmount * 100);
                
                logger.info("Processing refund for ticket {}: Original=₹{}, Refund=₹{}, CancellationFee=₹{}", 
                           ticketId, originalAmount, refundAmount, cancellationFee);
                
                // Call payment service to process refund
                refundId = paymentClient.refundPayment(ticket.getPaymentId(), refundAmountPaise);
                logger.info("Refund processed for ticket {}: refundId={}, amount=₹{}", ticketId, refundId, refundAmount);
                
                refundProcessed = true;
                refundStatus = "INITIATED";
                expectedRefundTime = "5-7 business days";
            } catch (Exception e) {
                logger.error("Refund failed for ticket {}: {}", ticketId, e.getMessage());
                refundStatus = "FAILED";
                expectedRefundTime = "Please contact support";
            }
        }

        // Update ticket status and increase train seats
        trainClient.increaseSeats(ticket.getTrainId(), ticket.getNoOfSeats());
        ticket.setStatus(TicketStatus.CANCELLED);
        ticketRepository.save(ticket);
        logger.info("Ticket cancelled: {}", ticketId);
        
        // Calculate cancellation fee for response
        double originalAmount = ticket.getAmount();
        double cancellationFee = refundProcessed ? originalAmount * 0.20 : 0.0;
        
        String message = String.format("Ticket %s cancelled successfully. %s", 
                                      ticket.getTicketNumber(),
                                      refundProcessed ? 
                                        String.format("Refund: ₹%.2f (after 20%% cancellation fee)", refundAmount) :
                                        "No refund applicable.");
        
        return new CancellationResponseDTO(
            message, 
            refundProcessed, 
            refundId, 
            refundAmount, 
            originalAmount,
            cancellationFee,
            refundStatus, 
            expectedRefundTime
        );
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
    
    // 9. Get ticket by order ID
    // This method retrieves a ticket based on the order ID, which is unique for each booking
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
    // 10. Get tickets by user email
    // This method retrieves all tickets booked by a user based on their email address
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
    // 11. Get booked seats count by train and date
    // This method retrieves the count of booked seats for a specific train on a given date
    @Override
    public int getBookedSeatsCountByTrainAndDate(Long trainId, LocalDate date) {
        logger.info("Fetching booked seats count for train {} on date {}", trainId, date);
        Integer bookedSeats = ticketRepository.getBookedSeatsCountByTrainAndDate(trainId, date);
        return bookedSeats != null ? bookedSeats : 0;
    }

   

}