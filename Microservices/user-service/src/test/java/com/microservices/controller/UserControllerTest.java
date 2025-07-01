package com.microservices.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.microservices.controllers.UserController;
import com.microservices.dto.AuthResponse;
import com.microservices.dto.LoginRequest;
import com.microservices.dto.RegisterRequest;
import com.microservices.exception.UserException;
import com.microservices.model.User;
import com.microservices.services.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userSer;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createUser_success() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setFullName("Test User");
        req.setEmail("test@mail.com");
        req.setPhone("1234567890");
        req.setPassword("password");
        req.setRole("USER");

        User user = new User();
        user.setFullName("Test User");
        user.setEmail("test@mail.com");

        Mockito.when(userSer.createUser(any(RegisterRequest.class))).thenReturn(user);

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Test User"));
    }

    @Test
    void createUser_error() throws Exception {
        RegisterRequest req = new RegisterRequest();
        Mockito.when(userSer.createUser(any(RegisterRequest.class)))
                .thenThrow(new UserException("User already exists"));

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("User already exists"));
    }

    @Test
    void loginUser_success() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail("test@mail.com");
        req.setPassword("password");

        AuthResponse resp = new AuthResponse("token123");
        Mockito.when(userSer.loginUser(any(LoginRequest.class))).thenReturn(resp);

        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token123"));
    }

    @Test
    void loginUser_error() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail("test@mail.com");
        req.setPassword("wrong");

        Mockito.when(userSer.loginUser(any(LoginRequest.class)))
                .thenThrow(new UserException("Invalid email or password"));

        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid email or password"));
    }

    @Test
    void getAllUser_success() throws Exception {
        Mockito.when(userSer.getAllUsers()).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/users/all"))
                .andExpect(status().isOk());
    }

    @Test
    void getUserById_success() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setFullName("Test User");
        Mockito.when(userSer.getUserById(1L)).thenReturn(user);

        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Test User"));
    }

    @Test
    void getUserById_error() throws Exception {
        Mockito.when(userSer.getUserById(1L)).thenThrow(new UserException("Not found"));
        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Not found"));
    }

    @Test
    void updateUser_success() throws Exception {
        User user = new User();
        user.setFullName("Updated");
        Mockito.when(userSer.updateUser(eq(1L), any(User.class))).thenReturn(user);

        mockMvc.perform(put("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Updated"));
    }

    @Test
    void deleteUserById_success() throws Exception {
        Mockito.doNothing().when(userSer).deleteUser(1L);
        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isAccepted())
                .andExpect(content().string("User deleted"));
    }

    @Test
    void validateToken_success() throws Exception {
        Mockito.doNothing().when(userSer).validateToken("token123");
        mockMvc.perform(get("/api/users/validate?token=token123"))
                .andExpect(status().isOk())
                .andExpect(content().string("Token is valid"));
    }

    @Test
    void forgotPassword_success() throws Exception {
        Mockito.doNothing().when(userSer).initiatePasswordReset(anyString(), anyString());
        mockMvc.perform(post("/api/users/forgot-password?email=test@mail.com"))
                .andExpect(status().isOk())
                .andExpect(content().string("If your email exists, a reset link has been sent."));
    }

    @Test
    void resetPassword_success() throws Exception {
        Mockito.doNothing().when(userSer).resetPassword(anyString(), anyString());
        mockMvc.perform(post("/api/users/reset-password?token=abc&newPassword=xyz"))
                .andExpect(status().isOk())
                .andExpect(content().string("Password reset successful."));
    }
}