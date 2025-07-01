package com.microservices.services;

import com.microservices.dto.AuthResponse;
import com.microservices.dto.LoginRequest;
import com.microservices.dto.RegisterRequest;
import com.microservices.exception.UserException;
import com.microservices.model.User;

import java.util.List;

public interface UserService {
    User createUser(RegisterRequest user) throws UserException;
    AuthResponse loginUser(LoginRequest user) throws UserException;
    User getUserById(Long id) throws UserException;
    List<User> getAllUsers();
    void deleteUser(Long id) throws UserException;
    User updateUser(Long id, User user) throws UserException;
    public void validateToken(String token);

    void initiatePasswordReset(String email, String appUrl) throws UserException;
    void resetPassword(String token, String newPassword) throws UserException;
}
