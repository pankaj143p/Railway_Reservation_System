package com.microservices.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TicketResponseDTO {
      private String userEmail;
      private String fullName;
      private int age;
      private String email;
      private String ticket_number;
      private LocalDate booking_date;
      private TrainDTO trainDetails;
}
