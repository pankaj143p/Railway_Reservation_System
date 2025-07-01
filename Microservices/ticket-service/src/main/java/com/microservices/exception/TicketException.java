package com.microservices.exception;

public class TicketException extends RuntimeException {
    public TicketException(String message) {
        super(message);
    }
}
