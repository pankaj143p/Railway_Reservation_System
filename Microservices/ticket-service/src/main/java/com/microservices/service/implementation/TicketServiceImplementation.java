package com.microservices.service.implementation;

import com.microservices.domain.TicketStatus;
import com.microservices.domain.TrainStatus;
import com.microservices.dto.TrainDTO;
import com.microservices.feign.TrainClient;
import com.microservices.model.TicketBooking;
import com.microservices.repository.TicketRepository;
import com.microservices.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TicketServiceImplementation implements TicketService {

    private final TicketRepository ticketRepository;

    private final TrainClient trainClient;

    @Override
    public String bookTicket(Long trainId, String fullName, int seatCount) {
        TrainDTO train = trainClient.getTrainById(trainId);
        if(train.getStatus() == TrainStatus.CANCELLED){
            return "Can not book. because this train has been cancelled";
        }

        int bookedSeats = ticketRepository.findByTrainId(trainId).stream()
                .filter(t->t.getStatus()== TicketStatus.BOOKED)
                .mapToInt(TicketBooking::getSeatCount).sum();

        if(train.getTotalSeats() - bookedSeats < seatCount){
            return "Not enough seats available !";
        }

        TicketBooking ticketBooking = new TicketBooking();
        ticketBooking.setTrainId(trainId);
        ticketBooking.setFullName(fullName);
        ticketBooking.setSeatCount(seatCount);
        ticketBooking.setStatus(TicketStatus.BOOKED);
        ticketRepository.save(ticketBooking);
        return "Ticket booked successfully";

    }

    @Override
    public String cancelTicket(Long ticketId) {
        return "";
    }

    @Override
    public int getAvailableSeats(Long trainId) {
        return 0;
    }
}
