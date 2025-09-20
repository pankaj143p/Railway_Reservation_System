package com.microservices.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatConfigurationRequest {
    
    @NotNull(message = "Sleeper seats count is required")
    @Min(value = 0, message = "Sleeper seats must be non-negative")
    private Integer sleeperSeats;
    
    @NotNull(message = "AC2 seats count is required")
    @Min(value = 0, message = "AC2 seats must be non-negative")
    private Integer ac2Seats;
    
    @NotNull(message = "AC1 seats count is required")
    @Min(value = 0, message = "AC1 seats must be non-negative")
    private Integer ac1Seats;
    
    @NotNull(message = "Sleeper price is required")
    @Min(value = 0, message = "Sleeper price must be non-negative")
    private BigDecimal sleeperPrice;
    
    @NotNull(message = "AC2 price is required")
    @Min(value = 0, message = "AC2 price must be non-negative")
    private BigDecimal ac2Price;
    
    @NotNull(message = "AC1 price is required")
    @Min(value = 0, message = "AC1 price must be non-negative")
    private BigDecimal ac1Price;
    
    // Helper method to calculate total seats
    public Integer getTotalSeats() {
        return sleeperSeats + ac2Seats + ac1Seats;
    }
    
    // Validation helper to check seat ratios
    public boolean isValidRatio() {
        int total = getTotalSeats();
        if (total == 0) return false;
        
        double sleeperRatio = (double) sleeperSeats / total;
        double ac2Ratio = (double) ac2Seats / total;
        double ac1Ratio = (double) ac1Seats / total;
        
        // Allow some tolerance in ratios (±5%)
        return sleeperRatio >= 0.45 && sleeperRatio <= 0.55 &&
               ac2Ratio >= 0.15 && ac2Ratio <= 0.25 &&
               ac1Ratio >= 0.25 && ac1Ratio <= 0.35;
    }
}
