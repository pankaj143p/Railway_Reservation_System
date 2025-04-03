package com.microservices.controllers;
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

    @PostMapping()
    public ResponseEntity<User> createUser(@RequestBody User user){
        User newUser = userSer.createUser(user);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }

    @GetMapping()
    public ResponseEntity<List<User>> getAllUser(){
        List<User> users = userSer.getAllUsers();
        return new ResponseEntity<>(users,HttpStatus.OK);
    }

    @GetMapping("/{id}")
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
}
