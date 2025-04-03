package com.microservices.controllers;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TrainController {

    @GetMapping("")
    public String addTrain(){
        return "Train will be start";
    }
}
