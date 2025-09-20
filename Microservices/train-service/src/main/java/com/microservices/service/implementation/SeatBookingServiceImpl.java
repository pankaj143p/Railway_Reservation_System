package com.microservices.service.implementation;

import com.microservices.dto.SeatAvailabilityResponse;
import com.microservices.dto.SeatBookingRequest;
import com.microservices.dto.SeatBookingResponse;
import com.microservices.exception.TrainException;
import com.microservices.model.SeatBooking;
import com.microservices.model.TrainDetails;
import com.microservices.repository.SeatBookingRepository;
import com.microservices.repository.TrainRepository;
import com.microservices.service.SeatBookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class SeatBookingServiceImpl implements SeatBookingService {

    private final SeatBookingRepository seatBookingRepository;
    private final TrainRepository trainRepository;

    private static final String SLEEPER = "SLEEPER";
    private static final String AC2 = "AC2";
    private static final String AC1 = "AC1";

    @Override
    public SeatBookingResponse bookSeats(SeatBookingRequest request) {
        log.info("Booking seats for train: {}, class: {}, date: {}", 
                request.getTrainId(), request.getSeatClass(), request.getBookingDate());

        // Validate train exists
        TrainDetails train = trainRepository.findById(request.getTrainId())
                .orElseThrow(() -> new TrainException("Train not found with ID: " + request.getTrainId()));

        // Check train is operational
        if (Boolean.FALSE.equals(train.getIsActive()) || !"OPERATIONAL".equals(train.getOperationalStatus())) {
            throw new TrainException("Train is not operational on the selected date");
        }

        // Check availability
        SeatAvailabilityResponse availability = getSeatAvailability(request.getTrainId(), request.getBookingDate());
        if (Boolean.FALSE.equals(availability.hasAvailabilityInClass(request.getSeatClass()))) {
            throw new TrainException("No seats available in " + request.getSeatClass() + " class");
        }

        if (availability.getAvailableSeatsInClass(request.getSeatClass()) < request.getNumberOfSeats()) {
            throw new TrainException("Only " + availability.getAvailableSeatsInClass(request.getSeatClass()) + 
                    " seats available in " + request.getSeatClass() + " class");
        }

        List<Integer> bookedSeatNumbers = new ArrayList<>();
        List<SeatBooking> bookings = new ArrayList<>();

        // Book seats
        for (int i = 0; i < request.getNumberOfSeats(); i++) {
            Integer seatNumber;
            
            // Use preferred seat if provided and available
            if (request.getPreferredSeatNumber() != null && i == 0) {
                if (Boolean.FALSE.equals(isSeatAvailable(request.getTrainId(), request.getPreferredSeatNumber(), 
                                   request.getSeatClass(), request.getBookingDate()))) {
                    throw new TrainException("Preferred seat " + request.getPreferredSeatNumber() + " is not available");
                }
                if (Boolean.FALSE.equals(isValidSeatForClass(request.getTrainId(), request.getPreferredSeatNumber(), request.getSeatClass()))) {
                    throw new TrainException("Seat " + request.getPreferredSeatNumber() + " is not valid for " + request.getSeatClass() + " class");
                }
                seatNumber = request.getPreferredSeatNumber();
            } else {
                seatNumber = getNextAvailableSeat(request.getTrainId(), request.getSeatClass(), request.getBookingDate());
                if (seatNumber == null) {
                    throw new TrainException("No more seats available in " + request.getSeatClass() + " class");
                }
            }

            // Create booking
            SeatBooking booking = new SeatBooking();
            booking.setTrainId(request.getTrainId());
            booking.setSeatNumber(seatNumber);
            booking.setSeatClass(request.getSeatClass());
            booking.setBookingDate(request.getBookingDate());
            booking.setPassengerName(request.getPassengerName());
            booking.setPassengerEmail(request.getPassengerEmail());
            booking.setPassengerPhone(request.getPassengerPhone());
            booking.setBookingStatus("CONFIRMED");

            try {
                booking = seatBookingRepository.save(booking);
                bookings.add(booking);
                bookedSeatNumbers.add(seatNumber);
                log.info("Booked seat {} for passenger {}", seatNumber, request.getPassengerName());
            } catch (Exception e) {
                log.error("Error booking seat {}: {}", seatNumber, e.getMessage());
                throw new TrainException("Failed to book seat " + seatNumber + ": " + e.getMessage());
            }
        }

        // Calculate total amount
        BigDecimal pricePerSeat = train.getPriceByClass(request.getSeatClass());
        BigDecimal totalAmount = pricePerSeat.multiply(new BigDecimal(request.getNumberOfSeats()));

        // Build response
        return SeatBookingResponse.builder()
                .bookingId(bookings.get(0).getId()) // Use first booking as primary
                .trainId(request.getTrainId())
                .trainName(train.getTrainName())
                .seatNumbers(bookedSeatNumbers)
                .seatClass(request.getSeatClass())
                .bookingDate(request.getBookingDate())
                .passengerName(request.getPassengerName())
                .passengerEmail(request.getPassengerEmail())
                .passengerPhone(request.getPassengerPhone())
                .bookingStatus("CONFIRMED")
                .totalAmount(totalAmount)
                .pricePerSeat(pricePerSeat)
                .createdAt(bookings.get(0).getCreatedAt())
                .source(train.getSource())
                .destination(train.getDestination())
                .departureTime(train.getDepartureTime().toString())
                .arrivalTime(train.getArrivalTime().toString())
                .pnr(String.format("PNR%010d", bookings.get(0).getId()))
                .build();
    }

    @Override
    public SeatBookingResponse bookSpecificSeat(Long trainId, Integer seatNumber, String seatClass, 
                                               LocalDate bookingDate, String passengerName, 
                                               String passengerEmail, String passengerPhone) {
        SeatBookingRequest request = new SeatBookingRequest();
        request.setTrainId(trainId);
        request.setPreferredSeatNumber(seatNumber);
        request.setSeatClass(seatClass);
        request.setBookingDate(bookingDate);
        request.setPassengerName(passengerName);
        request.setPassengerEmail(passengerEmail);
        request.setPassengerPhone(passengerPhone);
        request.setNumberOfSeats(1);

        return bookSeats(request);
    }

    @Override
    public SeatAvailabilityResponse getSeatAvailability(Long trainId, LocalDate date) {
        TrainDetails train = trainRepository.findById(trainId)
                .orElseThrow(() -> new TrainException("Train not found with ID: " + trainId));

        // Get booked seats by class
        List<Integer> sleeperBooked = getBookedSeats(trainId, SLEEPER, date);
        List<Integer> ac2Booked = getBookedSeats(trainId, AC2, date);
        List<Integer> ac1Booked = getBookedSeats(trainId, AC1, date);

        // Calculate availability
        SeatAvailabilityResponse response = SeatAvailabilityResponse.builder()
                .trainId(trainId)
                .trainName(train.getTrainName())
                .date(date)
                .sleeperTotalSeats(train.getSleeperSeats())
                .sleeperBookedSeats(sleeperBooked.size())
                .sleeperAvailableSeats(train.getSleeperSeats() - sleeperBooked.size())
                .sleeperPrice(train.getSleeperPrice())
                .sleeperBookedSeatNumbers(sleeperBooked)
                .ac2TotalSeats(train.getAc2Seats())
                .ac2BookedSeats(ac2Booked.size())
                .ac2AvailableSeats(train.getAc2Seats() - ac2Booked.size())
                .ac2Price(train.getAc2Price())
                .ac2BookedSeatNumbers(ac2Booked)
                .ac1TotalSeats(train.getAc1Seats())
                .ac1BookedSeats(ac1Booked.size())
                .ac1AvailableSeats(train.getAc1Seats() - ac1Booked.size())
                .ac1Price(train.getAc1Price())
                .ac1BookedSeatNumbers(ac1Booked)
                .source(train.getSource())
                .destination(train.getDestination())
                .departureTime(train.getDepartureTime().toString())
                .arrivalTime(train.getArrivalTime().toString())
                .build();

        response.calculateTotals();
        return response;
    }

    @Override
    public Boolean isSeatAvailable(Long trainId, Integer seatNumber, String seatClass, LocalDate date) {
        try {
            return seatBookingRepository.isSeatAvailable(trainId, seatNumber, seatClass, date);
        } catch (Exception e) {
            // Fallback to manual check
            return seatBookingRepository.countConfirmedBookingsForSeat(trainId, seatNumber, seatClass, date) == 0;
        }
    }

    @Override
    public Integer getNextAvailableSeat(Long trainId, String seatClass, LocalDate date) {
        try {
            return seatBookingRepository.getNextAvailableSeat(trainId, seatClass, date);
        } catch (Exception e) {
            // Fallback to manual search
            TrainDetails train = trainRepository.findById(trainId)
                    .orElseThrow(() -> new TrainException("Train not found"));
            
            int start = train.getSeatRangeStart(seatClass);
            int end = train.getSeatRangeEnd(seatClass);
            
            List<Integer> bookedSeats = getBookedSeats(trainId, seatClass, date);
            
            for (int seatNumber = start; seatNumber <= end; seatNumber++) {
                if (!bookedSeats.contains(seatNumber)) {
                    return seatNumber;
                }
            }
            return null;
        }
    }

    @Override
    public List<Integer> getBookedSeats(Long trainId, String seatClass, LocalDate date) {
        return seatBookingRepository.findBookedSeatNumbers(trainId, date, seatClass);
    }

    @Override
    public void cancelBooking(Long bookingId) {
        SeatBooking booking = seatBookingRepository.findById(bookingId)
                .orElseThrow(() -> new TrainException("Booking not found with ID: " + bookingId));
        
        booking.setBookingStatus("CANCELLED");
        seatBookingRepository.save(booking);
        log.info("Cancelled booking ID: {}", bookingId);
    }

    @Override
    public SeatBookingResponse getBookingDetails(Long bookingId) {
        SeatBooking booking = seatBookingRepository.findById(bookingId)
                .orElseThrow(() -> new TrainException("Booking not found with ID: " + bookingId));

        TrainDetails train = trainRepository.findById(booking.getTrainId())
                .orElseThrow(() -> new TrainException("Train not found"));

        BigDecimal pricePerSeat = train.getPriceByClass(booking.getSeatClass());

        return SeatBookingResponse.builder()
                .bookingId(booking.getId())
                .trainId(booking.getTrainId())
                .trainName(train.getTrainName())
                .seatNumbers(List.of(booking.getSeatNumber()))
                .seatClass(booking.getSeatClass())
                .bookingDate(booking.getBookingDate())
                .passengerName(booking.getPassengerName())
                .passengerEmail(booking.getPassengerEmail())
                .passengerPhone(booking.getPassengerPhone())
                .ticketId(booking.getTicketId())
                .bookingStatus(booking.getBookingStatus())
                .totalAmount(pricePerSeat)
                .pricePerSeat(pricePerSeat)
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .source(train.getSource())
                .destination(train.getDestination())
                .departureTime(train.getDepartureTime().toString())
                .arrivalTime(train.getArrivalTime().toString())
                .pnr(String.format("PNR%010d", booking.getId()))
                .build();
    }

    @Override
    public List<SeatBookingResponse> getPassengerBookings(String email) {
        List<SeatBooking> bookings = seatBookingRepository.findPassengerBookingHistory(email);
        return bookings.stream().map(booking -> {
            try {
                return getBookingDetails(booking.getId());
            } catch (Exception e) {
                log.error("Error getting booking details for ID: {}", booking.getId());
                return null;
            }
        }).filter(response -> response != null).toList();
    }

    @Override
    public List<SeatBooking> getTrainBookings(Long trainId, LocalDate date) {
        return seatBookingRepository.findByTrainIdAndBookingDate(trainId, date);
    }

    @Override
    public Boolean isValidSeatForClass(Long trainId, Integer seatNumber, String seatClass) {
        TrainDetails train = trainRepository.findById(trainId)
                .orElseThrow(() -> new TrainException("Train not found"));

        int start = train.getSeatRangeStart(seatClass);
        int end = train.getSeatRangeEnd(seatClass);

        return seatNumber >= start && seatNumber <= end;
    }
}
