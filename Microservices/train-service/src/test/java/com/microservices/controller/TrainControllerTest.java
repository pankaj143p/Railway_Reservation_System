package com.microservices.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.microservices.controllers.TrainController;
import com.microservices.domain.TrainStatus;
import com.microservices.model.TrainDetails;
import com.microservices.service.TrainService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TrainController.class)
class TrainControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TrainService trainService;

    @Autowired
    private ObjectMapper objectMapper;

    private TrainDetails getSampleTrain() {
        TrainDetails train = new TrainDetails();
        train.setTrainId(1L);
        train.setTrainName("Express");
        train.setSource("A");
        train.setDestination("B");
        train.setTotalSeats(100);
        train.setRoutes(Arrays.asList("A-B"));
        train.setDepartureTime(LocalTime.of(10, 0));
        train.setArrivalTime(LocalTime.of(12, 0));
        train.setStatus(TrainStatus.ON_TIME);
        train.setAmount(500);
        train.setDate(LocalDate.now());
        return train;
    }

    @Test
    void testAddTrain() throws Exception {
        TrainDetails train = getSampleTrain();
        Mockito.when(trainService.addTrain(any(TrainDetails.class))).thenReturn(train);

        mockMvc.perform(post("/trains/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(train)))
                .andExpect(status().isOk())
                .andExpect(content().string("Train added successfully"));
    }

    @Test
    void testGetTrainById() throws Exception {
        TrainDetails train = getSampleTrain();
        Mockito.when(trainService.getTrainById(1L)).thenReturn(train);

        mockMvc.perform(get("/trains/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.trainName").value("Express"));
    }

    @Test
    void testGetAllTrain() throws Exception {
        List<TrainDetails> trains = Arrays.asList(getSampleTrain());
        Mockito.when(trainService.getAllTrains()).thenReturn(trains);

        mockMvc.perform(get("/trains/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].trainName").value("Express"));
    }

    @Test
    void testSearchTrain() throws Exception {
        List<TrainDetails> trains = Arrays.asList(getSampleTrain());
        Mockito.when(trainService.searchTrains(anyString())).thenReturn(trains);

        mockMvc.perform(get("/trains/search").param("keyword", "Exp"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].trainName").value("Express"));
    }

    @Test
    void testUpdateTrain() throws Exception {
        TrainDetails train = getSampleTrain();
        Mockito.when(trainService.updateTrain(eq(1L), any(TrainDetails.class))).thenReturn(train);

        mockMvc.perform(put("/trains/update/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(train)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.trainName").value("Express"));
    }

    @Test
    void testDeleteTrain() throws Exception {
        Mockito.doNothing().when(trainService).deleteTrain(1L);

        mockMvc.perform(delete("/trains/1"))
                .andExpect(status().isAccepted())
                .andExpect(content().string("Train Deleted"));
    }

    @Test
    void testGetTodayTrains() throws Exception {
        List<TrainDetails> trains = Arrays.asList(getSampleTrain());
        Mockito.when(trainService.getTodayTrains()).thenReturn(trains);

        mockMvc.perform(get("/trains/today"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].trainName").value("Express"));
    }

    @Test
    void testGetByDate() throws Exception {
        List<TrainDetails> trains = Arrays.asList(getSampleTrain());
        Mockito.when(trainService.getTrainsByDate(any(LocalDate.class))).thenReturn(trains);

        mockMvc.perform(get("/trains/byDate").param("date", LocalDate.now().toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].trainName").value("Express"));
    }

    @Test
    void testGetByRoute() throws Exception {
        List<TrainDetails> trains = Arrays.asList(getSampleTrain());
        Mockito.when(trainService.getTrainsBySourceAndDestination(anyString(), anyString())).thenReturn(trains);

        mockMvc.perform(get("/trains/route").param("source", "A").param("destination", "B"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].trainName").value("Express"));
    }

    @Test
    void testDecreaseSeats() throws Exception {
        Mockito.when(trainService.decreaseSeats(1L, 2)).thenReturn("Seats updated successfully");

        mockMvc.perform(put("/trains/1/seats/decrease").param("count", "2"))
                .andExpect(status().isOk())
                .andExpect(content().string("Seats updated successfully"));
    }

    @Test
    void testIncreaseSeats() throws Exception {
        Mockito.when(trainService.increaseSeats(1L, 2)).thenReturn("Seats updated successfully");

        mockMvc.perform(put("/trains/1/seats/increase").param("count", "2"))
                .andExpect(status().isOk())
                .andExpect(content().string("Seats updated successfully"));
    }
}