package com.microservices.repository;

import com.microservices.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByFullNameContaining(String name);
    Optional<User> findByEmail(String email);
    List<User> findByEmailContaining(String email);
    List<User> findByPhoneContaining(String phone);
    Optional<User> findByResetToken(String resetToken);
}


