package com.microservices.chatbotservice.controller;

import com.microservices.chatbotservice.model.ChatRequest;
import com.microservices.chatbotservice.model.ChatResponse;
import com.microservices.chatbotservice.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        String response = chatbotService.getResponse(request.getMessage());
        return ResponseEntity.ok(new ChatResponse(response));
    }
}
