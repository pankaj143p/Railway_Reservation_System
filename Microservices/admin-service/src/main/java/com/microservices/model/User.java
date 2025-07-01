package com.microservices.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

import org.springframework.boot.autoconfigure.domain.EntityScan;

@AllArgsConstructor
@NoArgsConstructor
@Data
@EntityScan
public class User {

     @Id
     @GeneratedValue(strategy = GenerationType.AUTO)
     private Long id;
     private String fullName;
     private String email;
     private String phone;
     private String role;
     private String password;
     private LocalDateTime createdAt;
     private LocalDateTime updatedAt;

     @PrePersist
     public void onCreate() {
          createdAt = LocalDateTime.now();
          updatedAt = LocalDateTime.now();
     }

     @PreUpdate
     public void onUpdate() {
          updatedAt = LocalDateTime.now();
     }
}
