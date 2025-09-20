package com.microservices.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatBookingResponse {
    
    private Long bookingId;
    private Long trainId;
    private String trainName;
    private List<Integer> seatNumbers;
    private String seatClass;
    private LocalDate bookingDate;
    private String passengerName;
    private String passengerEmail;
    private String passengerPhone;
    private Long ticketId;
    private String bookingStatus;
    private BigDecimal totalAmount;
    private BigDecimal pricePerSeat;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Additional booking details
    private String source;
    private String destination;
    private String departureTime;
    private String arrivalTime;
    private String pnr; // Can be generated based on booking ID
    
    // Helper method to generate PNR
    public String generatePnr() {
        if (bookingId != null) {
            return String.format("PNR%010d", bookingId);
        }
        return null;
    }
}
