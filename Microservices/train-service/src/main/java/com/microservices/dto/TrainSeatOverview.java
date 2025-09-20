package com.microservices.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainSeatOverview {
    
    private Long trainId;
    private String trainName;
    private String source;
    private String destination;
    private Integer totalSeats;
    
    // Seat configuration
    private Integer sleeperSeats;
    private Integer ac2Seats;
    private Integer ac1Seats;
    
    // Pricing
    private BigDecimal sleeperPrice;
    private BigDecimal ac2Price;
    private BigDecimal ac1Price;
    
    // Status
    private Boolean isConfigured;
    private String operationalStatus;
    
    // Calculated ratios
    public Double getSleeperRatio() {
        if (totalSeats == null || totalSeats == 0 || sleeperSeats == null) return 0.0;
        return (double) sleeperSeats / totalSeats * 100;
    }
    
    public Double getAc2Ratio() {
        if (totalSeats == null || totalSeats == 0 || ac2Seats == null) return 0.0;
        return (double) ac2Seats / totalSeats * 100;
    }
    
    public Double getAc1Ratio() {
        if (totalSeats == null || totalSeats == 0 || ac1Seats == null) return 0.0;
        return (double) ac1Seats / totalSeats * 100;
    }
    
    // Revenue potential calculations
    public BigDecimal getMaxSleeperRevenue() {
        if (sleeperSeats == null || sleeperPrice == null) return BigDecimal.ZERO;
        return sleeperPrice.multiply(BigDecimal.valueOf(sleeperSeats));
    }
    
    public BigDecimal getMaxAc2Revenue() {
        if (ac2Seats == null || ac2Price == null) return BigDecimal.ZERO;
        return ac2Price.multiply(BigDecimal.valueOf(ac2Seats));
    }
    
    public BigDecimal getMaxAc1Revenue() {
        if (ac1Seats == null || ac1Price == null) return BigDecimal.ZERO;
        return ac1Price.multiply(BigDecimal.valueOf(ac1Seats));
    }
    
    public BigDecimal getMaxTotalRevenue() {
        return getMaxSleeperRevenue()
                .add(getMaxAc2Revenue())
                .add(getMaxAc1Revenue());
    }
}
