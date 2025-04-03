package com.microservices.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class User {

     @Id
     @GeneratedValue(strategy = GenerationType.AUTO)
     private Long id;
     private String fullName;
     private String email;
     private String phone;
     private String role;
     private LocalDateTime createdAt;
     private LocalDateTime updatedAt;
}
