package com.microservices.controllers;

import com.microservices.dto.AuthResponse;
import com.microservices.dto.LoginRequest;
import com.microservices.dto.RegisterRequest;
import com.microservices.exception.UserException;
import com.microservices.model.User;
import com.microservices.services.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    // for logging and debugging
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userSer;
    
    // Register a new user
    @PostMapping("/register")
    public ResponseEntity<?> createUser(@Valid @RequestBody RegisterRequest user) {
        try {
            User newUser = userSer.createUser(user);
            logger.info("User registered: {}", newUser.getEmail());
            return ResponseEntity.ok(newUser);
        } catch (UserException e) {
            logger.error("Registration failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    // Login an existing user
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest req) {
        try {
            AuthResponse newRes = userSer.loginUser(req);
            logger.info("Login successful for: {}", req.getEmail());
            return ResponseEntity.ok(newRes);
        } catch (Exception e) {
            logger.error("Login failed for {}: {}", req.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }


    // Get all users
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUser() {
        List<User> users = userSer.getAllUsers();
        logger.info("Fetched all users, count: {}", users.size());
        return new ResponseEntity<>(users, HttpStatus.OK);
    }


    // Search users by name, email, or phone
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            User user = userSer.getUserById(id);
            logger.info("Fetched user by id: {}", id);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (UserException e) {
            logger.error("User not found: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    // Update user details
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody User user) {
        try {
            User updatedUser = userSer.updateUser(id, user);
            logger.info("Updated user: {}", id);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (UserException e) {
            logger.error("Update failed for user {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    // Delete user by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUserById(@PathVariable Long id) {
        try {
            userSer.deleteUser(id);
            logger.info("Deleted user: {}", id);
            return new ResponseEntity<>("User deleted", HttpStatus.ACCEPTED);
        } catch (UserException e) {
            logger.error("Delete failed for user {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    // Validate JWT token
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestParam String token) {
        try {
            userSer.validateToken(token);
            logger.info("Token validated");
            return ResponseEntity.ok("Token is valid");
        } catch (Exception e) {
            logger.error("Token validation failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }


    // Password reset functionality
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email, HttpServletRequest req) {
        try {
            String appUrl = req.getRequestURL().toString().replace(req.getRequestURI(), req.getContextPath());
            userSer.initiatePasswordReset(email, appUrl);
            logger.info("Password reset initiated for: {}", email);
            return ResponseEntity.ok("If your email exists, a reset link has been sent.");
        } catch (Exception e) {
            logger.error("Password reset failed for {}: {}", email, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to initiate password reset.");
        }
    }

    // Reset password using token
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        try {
            userSer.resetPassword(token, newPassword);
            logger.info("Password reset successful for token: {}", token);
            return ResponseEntity.ok("Password reset successful.");
        } catch (Exception e) {
            logger.error("Password reset failed for token {}: {}", token, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token.");
        }
    }
}