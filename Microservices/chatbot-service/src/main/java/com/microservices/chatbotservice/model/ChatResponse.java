package com.microservices.chatbotservice.model;

import lombok.Data;

@Data
public class ChatResponse {
    private String response;

    public ChatResponse(String response) {
        this.response = response;
    }
}
