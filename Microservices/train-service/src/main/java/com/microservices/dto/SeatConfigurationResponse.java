package com.microservices.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatConfigurationResponse {
    
    private Long trainId;
    private String trainName;
    
    // Seat configuration
    private Integer sleeperSeats;
    private Integer ac2Seats;
    private Integer ac1Seats;
    private Integer totalSeats;
    
    // Pricing
    private BigDecimal sleeperPrice;
    private BigDecimal ac2Price;
    private BigDecimal ac1Price;
    
    // Seat ranges
    private Integer sleeperRangeStart;
    private Integer sleeperRangeEnd;
    private Integer ac2RangeStart;
    private Integer ac2RangeEnd;
    private Integer ac1RangeStart;
    private Integer ac1RangeEnd;
}
