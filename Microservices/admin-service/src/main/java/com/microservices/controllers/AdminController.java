package com.microservices.controllers;
import com.microservices.dto.*;

import com.microservices.feignclients.tickets.TicketServiceClient;
import com.microservices.feignclients.trains.TrainServiceClient;
import com.microservices.feignclients.users.UserServiceClient;
import com.microservices.model.*;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {


    private final UserServiceClient userServiceClient;

    private final TrainServiceClient trainServiceClient;

    private final TicketServiceClient ticketServiceClient;

    // User APIs
    @GetMapping("/api/users")
    public List<User> getAllUsers() { return userServiceClient.getAllUser(); }

    @GetMapping("/api/users/{id}")
    public User getUserById(@PathVariable Long id) { return userServiceClient.getUserById(id); }

    @PostMapping("/api/users/register")
    public String createUser(@RequestBody RegisterRequest user) { return userServiceClient.createUser(user); }

    @PostMapping("/api/users/login")
    public AuthResponse loginUser(@RequestBody LoginRequest req) { return userServiceClient.loginUser(req); }

    @PutMapping("/api/users/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) { return userServiceClient.updateUser(id, user); }

    @DeleteMapping("/api/users/{id}")
    public String deleteUser(@PathVariable Long id) { return userServiceClient.deleteUserById(id); }

    @GetMapping("/api/users/validate")
    public String validateToken(@RequestParam String token) { return userServiceClient.validateToken(token); }

    // Train APIs
    @GetMapping("/trains")
    public List<TrainDetails> getAllTrains() { return trainServiceClient.getAllTrain(); }

    @GetMapping("/trains/{id}")
    public TrainDetails getTrainById(@PathVariable Long id) { return trainServiceClient.getTrainById(id); }

    @PostMapping("/trains/add")
    public String addTrain(@RequestBody TrainDetails req) { return trainServiceClient.addTrain(req); }

    @GetMapping("/trains/search")
    public List<TrainDetails> searchTrain(@RequestParam String keyword) { return trainServiceClient.searchTrain(keyword); }

    @PutMapping("/trains/update/{id}")
    public TrainDetails updateTrain(@PathVariable Long id, @RequestBody TrainDetails train) { return trainServiceClient.updateTrain(id, train); }

    @DeleteMapping("/trains/{id}")
    public String deleteTrain(@PathVariable Long id) { return trainServiceClient.deleteTrain(id); }

    @GetMapping("/trains/today")
    public List<TrainDetails> getTodayTrains() { return trainServiceClient.getTodayTrains(); }

    @GetMapping("/trains/byDate")
    public List<TrainDetails> getByDate(@RequestParam String date) { return trainServiceClient.getByDate(date); }

    @GetMapping("/trains/route")
    public List<TrainDetails> getByRoute(@RequestParam String source, @RequestParam String destination) {
        return trainServiceClient.getByRoute(source, destination);
    }

    @PutMapping("/trains/{id}/seats/decrease")
    public String decreaseSeats(@PathVariable Long id, @RequestParam int count, @RequestParam String date) {
        return trainServiceClient.decreaseSeats(id, count, date);
    }

    @PutMapping("/trains/{id}/seats/increase")
    public String increaseSeats(@PathVariable Long id, @RequestParam int count) {
        return trainServiceClient.increaseSeats(id, count);
    }

    // Ticket APIs
    @GetMapping("/tickets")
    public List<TicketBooking> getAllTickets() { return ticketServiceClient.getAllTickets(); }

    @GetMapping("/tickets/{ticketId}")
    public TicketBooking getTicketDetails(@PathVariable Long ticketId) { return ticketServiceClient.getTicketDetails(ticketId); }

    @PostMapping("/tickets/book/{train_id}")
    public TicketResponseDTO bookTicket(@PathVariable Long train_id, @RequestBody TicketRequestDTO req) {
        return ticketServiceClient.bookTicket(train_id, req);
    }

    @PutMapping("/tickets/cancel/{ticketId}")
    public String cancelTicket(@PathVariable Long ticketId) { return ticketServiceClient.cancelTicket(ticketId); }
}