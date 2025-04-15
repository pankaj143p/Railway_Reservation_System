package com.microservices.controllers;
import com.microservices.dto.AuthResponse;
import com.microservices.dto.LoginRequest;
import com.microservices.dto.RegisterRequest;
import com.microservices.exception.UserException;
import com.microservices.model.User;
import com.microservices.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userSer;

    @PostMapping("/register")
    public ResponseEntity<String> createUser(@RequestBody RegisterRequest user){
        String newUser = userSer.createUser(user);
        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@RequestBody LoginRequest req){
        AuthResponse newRes = userSer.loginUser(req);
        return ResponseEntity.ok(newRes);
    }

    @GetMapping()
    public ResponseEntity<List<User>> getAllUser(){
        List<User> users = userSer.getAllUsers();
        return new ResponseEntity<>(users,HttpStatus.OK);
    }

    @GetMapping("id/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) throws UserException {
        User user = userSer.getUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id, @RequestBody User user) throws UserException {
        User updatedUser = userSer.updateUser(id,user);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUserById(@PathVariable Long id) throws UserException {
        userSer.deleteUser(id);
        return new ResponseEntity<>("User deleted" ,HttpStatus.ACCEPTED);
    }

    @GetMapping("/validate")
    public ResponseEntity<String> validateToken(@RequestParam String token) {
        userSer.validateToken(token);
        return ResponseEntity.ok("Token is valid");
    }


}