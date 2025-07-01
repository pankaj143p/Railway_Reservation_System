package com.microservices.services.implementation;

import com.microservices.config.JwtUtil;
import com.microservices.dto.AuthResponse;
import com.microservices.dto.LoginRequest;
import com.microservices.dto.RegisterRequest;
import com.microservices.emailservice.EmailService;
import com.microservices.exception.UserException;
import com.microservices.model.User;
import com.microservices.repository.UserRepository;
import com.microservices.services.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImplementation implements UserService {
    
    // for logging ans debugging
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImplementation.class);

    private final UserRepository userRep;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    
    // to normalize role
    public String normalizeRole(String inputRole) {
        if (inputRole == null) return "ROLE_USER";
        String role = inputRole.trim().toUpperCase();
        if (role.equals("ADMIN")) return "ROLE_ADMIN";
        if (role.equals("USER")) return "ROLE_USER";
        throw new IllegalArgumentException("Invalid role: " + inputRole);
    }
    

    // Register a new user
    @Override
    public User createUser(RegisterRequest request) throws UserException {
        if (userRep.findByEmail(request.getEmail()).isPresent()) {
            logger.warn("Attempt to register with existing email: {}", request.getEmail());
            throw new UserException("User with this email already exists!");
        }
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        String normalizedRole = normalizeRole(request.getRole());
        user.setRole(normalizedRole);
        logger.info("Registering new user: {}", user.getEmail());
        return userRep.save(user);
    }
   

    // Login user and generate JWT token
@Override
public AuthResponse loginUser(LoginRequest req) throws UserException {
    Optional<User> userOpt = userRep.findByEmail(req.getEmail());
    if(userOpt.isPresent()){
        User user = userOpt.get();
        if(passwordEncoder.matches(req.getPassword(), user.getPassword())){
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
            logger.info("Login successful for: {}", user.getEmail());
            return new AuthResponse(token);
        }
    }
    logger.warn("Login failed for: {}", req.getEmail());
    throw new UserException("Invalid email or password");
}
    
    // Fetch user by ID
    @Override
    public User getUserById(Long id) throws UserException {
        Optional<User> otp = userRep.findById(id);
        if(otp.isPresent()){
            logger.info("Fetched user by id: {}", id);
            return otp.get();
        }
        logger.warn("User not found with id: {}", id);
        throw new UserException("User not found with id: "+id);
    }
     
    // Fetch all users
    @Override
    public List<User> getAllUsers() {
        logger.info("Fetching all users");
        return userRep.findAll();
    }
    
    // Search users by name, email, or phone
    @Override
    public void deleteUser(Long id) throws UserException {
        Optional<User> otp = userRep.findById(id);
        if(otp.isEmpty()){
            logger.warn("Attempt to delete non-existent user: {}", id);
            throw new UserException("User not found with id : "+id);
        }
        userRep.deleteById(id);
        logger.info("Deleted user: {}", id);
    }
   

    // update user details
    @Override
    public User updateUser(Long id, User user) throws UserException {
        Optional<User> otp = userRep.findById(id);
        if(otp.isEmpty()){
            logger.warn("Attempt to update non-existent user: {}", id);
            throw new UserException("User not found with id : "+id);
        }
        User exUser = otp.get();
        exUser.setFullName(user.getFullName());
        exUser.setEmail(user.getEmail());
        exUser.setRole(normalizeRole(user.getRole()));
        exUser.setPhone(user.getPhone());
        logger.info("Updated user: {}", id);
        return userRep.save(exUser);
    }

    // Validate JWT token
    @Override
    public void validateToken(String token) {
        String email = jwtUtil.validateToken(token);
        userRep.findByEmail(email).orElseThrow(() -> {
            logger.warn("Token validation failed for email: {}", email);
            return new RuntimeException("Unauthorized");
        });
        logger.info("Token validated for email: {}", email);
    }

     
    // initiate password reset
    @Override
    public void initiatePasswordReset(String email, String appUrl) throws UserException {
        Optional<User> opt = userRep.findByEmail(email);
        if(opt.isPresent()){
            User user = opt.get();
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            userRep.save(user);
            String resetLink = appUrl + "/reset-password?token="+token;
            emailService.sendResetEmail(email, resetLink);
            logger.info("Password reset initiated for: {}", email);
        } else {
            logger.warn("Password reset requested for non-existent email: {}", email);
        }
    }

    // Reset password using token
    @Override
    public void resetPassword(String token, String newPassword) throws UserException {
        Optional<User> opt = userRep.findByResetToken(token);
        if(opt.isEmpty()) {
            logger.warn("Invalid or expired reset token: {}", token);
            throw new UserException("Invalid or expired token");
        }
        User user = opt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        userRep.save(user);
        logger.info("Password reset successful for user: {}", user.getEmail());
    }
}