package com.microservices.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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
     @NotBlank(message = "Full name is required")
     private String fullName;

     @Email(message = "Invalid email format")
     @NotBlank(message = "Email is required")
     private String email;

     @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone must be 10 to 15 digits")
     @NotBlank(message = "Phone is required")
     private String phone;

     @NotBlank(message = "Role is required")
     private String role;

     @NotBlank(message = "Password is required")
     @Size(min = 6, message = "Password must be at least 6 characters")
     private String password;

     private LocalDateTime createdAt;
     private LocalDateTime updatedAt;

     private String resetToken;
     private LocalDateTime resetTokenExpiry;

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