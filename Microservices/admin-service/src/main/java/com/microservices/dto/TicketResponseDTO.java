package com.microservices.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TicketResponseDTO {
      private String fullName;
      private int age;
      private String email;
      private String ticket_number;
      private LocalDateTime booking_date;
      private TrainDTO trainDetails;
}
