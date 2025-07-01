package com.microservices.feignclients.users;

import com.microservices.dto.AuthResponse;
import com.microservices.dto.LoginRequest;
import com.microservices.dto.RegisterRequest;
import com.microservices.model.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "user-service")
public interface UserServiceClient {
    @PostMapping("/api/users/register")
    String createUser(@RequestBody RegisterRequest user);

    @PostMapping("/api/users/login")
    AuthResponse loginUser(@RequestBody LoginRequest req);

    @GetMapping("/api/users")
    List<User> getAllUser();

    @GetMapping("/api/users/id/{id}")
    User getUserById(@PathVariable("id") Long id);

    @PutMapping("/api/users/{id}")
    User updateUser(@PathVariable("id") Long id, @RequestBody User user);

    @DeleteMapping("/api/users/{id}")
    String deleteUserById(@PathVariable("id") Long id);

    @GetMapping("/api/users/validate")
    String validateToken(@RequestParam("token") String token);
}