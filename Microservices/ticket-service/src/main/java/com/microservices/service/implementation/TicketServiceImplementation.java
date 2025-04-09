package com.microservices.service.implementation;

import com.microservices.component.Methods;
import com.microservices.domain.TicketStatus;
import com.microservices.domain.TrainStatus;
import com.microservices.dto.TicketRequestDTO;
import com.microservices.dto.TicketResponseDTO;
import com.microservices.dto.TrainDTO;
import com.microservices.feign.TrainClient;
import com.microservices.model.TicketBooking;
import com.microservices.repository.TicketRepository;
import com.microservices.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TicketServiceImplementation implements TicketService {

    private final TicketRepository ticketRepository;

    private final TrainClient trainClient;

    private final Methods methods;

    @Override
        public TicketResponseDTO bookTicket(Long train_id, TicketRequestDTO request) {
            // Get train info
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

            ticketRepository.save(ticket);

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
    public String cancelTicket(Long ticketId) {
        return "";
    }

    @Override
    public int getAvailableSeats(Long trainId) {
        return 0;
    }

    @Override
    public TicketResponseDTO getTicketDetails(Long ticket_id) {
        return null;
    }
}
