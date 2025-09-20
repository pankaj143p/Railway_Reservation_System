package com.microservices.exception;

public class TrainException extends RuntimeException {
    public TrainException(String message){
        super(message);
    }
    
    public TrainException(String message, Throwable cause){
        super(message, cause);
    }
}
