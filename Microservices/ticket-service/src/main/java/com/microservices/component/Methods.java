package com.microservices.component;

import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class Methods {
    public String generateTicketNumber() {
        String uuid = UUID.randomUUID().toString().replace("-", "");
        String shortId = uuid.substring(0, 8).toUpperCase();
        return "TCKT-" + shortId;
    }
    public int sub(int a, int b){
    return a-b;
    }

    public int add(int a, int b){
        return a+b;
    }
}
