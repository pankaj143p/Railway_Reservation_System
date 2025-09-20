package com.microservices.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatAvailabilityResponse {
    
    private Long trainId;
    private String trainName;
    private LocalDate date;
    
    // Sleeper class information
    private Integer sleeperTotalSeats;
    private Integer sleeperAvailableSeats;
    private Integer sleeperBookedSeats;
    private BigDecimal sleeperPrice;
    private List<Integer> sleeperBookedSeatNumbers;
    
    // AC2 class information
    private Integer ac2TotalSeats;
    private Integer ac2AvailableSeats;
    private Integer ac2BookedSeats;
    private BigDecimal ac2Price;
    private List<Integer> ac2BookedSeatNumbers;
    
    // AC1 class information
    private Integer ac1TotalSeats;
    private Integer ac1AvailableSeats;
    private Integer ac1BookedSeats;
    private BigDecimal ac1Price;
    private List<Integer> ac1BookedSeatNumbers;
    
    // Overall availability
    private Integer totalSeats;
    private Integer totalAvailableSeats;
    private Integer totalBookedSeats;
    private Boolean isAvailable;
    
    // Route information
    private String source;
    private String destination;
    private String departureTime;
    private String arrivalTime;
    
    // Helper methods
    public void calculateTotals() {
        this.totalSeats = sleeperTotalSeats + ac2TotalSeats + ac1TotalSeats;
        this.totalAvailableSeats = sleeperAvailableSeats + ac2AvailableSeats + ac1AvailableSeats;
        this.totalBookedSeats = sleeperBookedSeats + ac2BookedSeats + ac1BookedSeats;
        this.isAvailable = totalAvailableSeats > 0;
    }
    
    public Boolean hasAvailabilityInClass(String seatClass) {
        return switch (seatClass.toUpperCase()) {
            case "SLEEPER" -> sleeperAvailableSeats > 0;
            case "AC2" -> ac2AvailableSeats > 0;
            case "AC1" -> ac1AvailableSeats > 0;
            default -> false;
        };
    }
    
    public Integer getAvailableSeatsInClass(String seatClass) {
        return switch (seatClass.toUpperCase()) {
            case "SLEEPER" -> sleeperAvailableSeats;
            case "AC2" -> ac2AvailableSeats;
            case "AC1" -> ac1AvailableSeats;
            default -> 0;
        };
    }
    
    public BigDecimal getPriceForClass(String seatClass) {
        return switch (seatClass.toUpperCase()) {
            case "SLEEPER" -> sleeperPrice;
            case "AC2" -> ac2Price;
            case "AC1" -> ac1Price;
            default -> BigDecimal.ZERO;
        };
    }
}
