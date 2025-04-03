package com.microservices.repository;

import com.microservices.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    // Correct the method to search by fullName containing the provided string
    List<User> findByFullNameContaining(String name);

    // Alternatively, you can create other methods for email or phone
    List<User> findByEmailContaining(String email);
    List<User> findByPhoneContaining(String phone);
}
