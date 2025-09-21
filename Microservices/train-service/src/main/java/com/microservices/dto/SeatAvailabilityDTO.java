package com.microservices.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatAvailabilityDTO {
    private String seatClass;
    private Integer availableSeats;
    private Integer totalSeats;
    private BigDecimal price;
    private Integer seatRangeStart;
    private Integer seatRangeEnd;
}