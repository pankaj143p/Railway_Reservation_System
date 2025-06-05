package com.microservices.service.implementation;

import com.microservices.component.Methods;
import com.microservices.domain.TicketStatus;
import com.microservices.dto.TicketRequestDTO;
import com.microservices.dto.TicketResponseDTO;
import com.microservices.dto.TrainDTO;
import com.microservices.feign.PaymentClient;
import com.microservices.feign.TrainClient;
import com.microservices.model.TicketBooking;
import com.microservices.repository.TicketRepository;
import com.microservices.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TicketServiceImplementation implements TicketService {
    private final TicketRepository ticketRepository;
    private final TrainClient trainClient;
    private final Methods methods;
    private final PaymentClient paymentClient;

    @Override
        public TicketResponseDTO bookTicket(Long train_id, TicketRequestDTO request) {
            // Get train info
        int amount = request.getSeatCount() * 10 * 140;

        // Step 1: Create payment order using Razorpay
        String paymentRes = paymentClient.createOrder(amount);
        System.out.println("Payment response: " + paymentRes);

        // Check if the order ID is valid
        if (paymentRes == null || !paymentRes.contains("order_")) {
            throw new RuntimeException("Payment failed or Invalid response from Razorpay");
        }

        // Step 2: Proceed to frontend (Razorpay checkout form) to get payment details
        // After the user pays, you get the paymentId and razorpaySign (signature)

        // For the sake of this example, assume that we are getting these values from frontend
        // Normally, you will receive these values in the callback or from the client (JavaScript).
        String paymentId = "razorpay_payment_id";  // This will come from frontend after payment
        String razorpaySign = "razorpay_signature"; // This will come from frontend after payment

        // Step 3: Verify the payment with Razorpay
        boolean isPaymentVerified = paymentClient.verifyPayment(paymentRes, paymentId, razorpaySign);
        if (!isPaymentVerified) {
            throw new RuntimeException("Payment verification failed");
        }

        TrainDTO train = trainClient.getTrainById(train_id);

            TicketBooking ticket = new TicketBooking();
            ticket.setFullName(request.getFullName());
            ticket.setAge(request.getAge());
            ticket.setEmail(request.getEmail());
            ticket.setBookingDate(LocalDateTime.now());
            ticket.setTicketNumber(methods.generateTicketNumber());

            // Add train details
            ticket.setTrainId(train_id);
            ticket.setTrainName(train.getTrainName());
            ticket.setSource(train.getSource());
            ticket.setDestination(train.getDestination());
            ticket.setDepartureTime(LocalDateTime.now());
            ticket.setStatus(TicketStatus.BOOKED);
            ticket.setNoOfSeats(request.getSeatCount());

           ticketRepository.save(ticket);

            // update noOfSeats
            trainClient.decreaseSeats(train_id, request.getSeatCount());
            // Prepare response
            TicketResponseDTO response = new TicketResponseDTO();
            response.setFullName(ticket.getFullName());
            response.setAge(ticket.getAge());
            response.setEmail(ticket.getEmail());
            response.setTicket_number(ticket.getTicketNumber());
            response.setBooking_date(ticket.getBookingDate());
            response.setTrainDetails(train);

            return response;
        }


    @Override
    // method for cancel ticket
    public String cancelTicket(Long ticketId) {
        Optional<TicketBooking> otp = ticketRepository.findById(ticketId);
        if(otp.isPresent()){
            TicketBooking ticket = otp.get();
            if(ticket.getStatus() == TicketStatus.CANCELLED) {
                return "Ticket "+ticket.getTicketNumber()+" already cancelled!";
            }
            if(ticket.getStatus() == TicketStatus.WAITING){
                return "Ticket "+ticket.getTicketNumber()+" is pending, Please confirm it";
            }
            trainClient.increaseSeats(ticket.getTrainId(), ticket.getNoOfSeats());
            ticket.setStatus(TicketStatus.CANCELLED);
            ticketRepository.save(ticket);

            return "Ticket with ticket number "+ticket.getTicketNumber()+" has been cancelled ";
        }
        throw new RuntimeException("ticket not found");
    }

    @Override
    public int getAvailableSeats(Long trainId) {
        return 0;
    }

    @Override
    public TicketBooking getTicketDetails(Long ticket_id) {
        Optional<TicketBooking> otp = ticketRepository.findById(ticket_id);
        if(otp.isPresent()){
            return otp.get();
        }
        throw new RuntimeException("ticket with "+ticket_id+"not present!");
    }

    @Override
    public List<TicketBooking> getAllTickets() {
        return ticketRepository.findAll();
    }
}
