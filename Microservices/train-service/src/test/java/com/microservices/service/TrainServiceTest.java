package com.microservices.service;
import com.microservices.exception.TrainException;
import com.microservices.model.TrainDetails;
import com.microservices.repository.TrainRepository;
import com.microservices.service.implementation.TrainServiceImplementation;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TrainServiceTest {

    @Mock
    private TrainRepository trainRepository;

    @InjectMocks
    private TrainServiceImplementation trainService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // --- addTrain ---
    @Test
    void addTrain_success() {
        TrainDetails req = new TrainDetails();
        req.setTrainName("Rajdhani Express");
        req.setTotalSeats(100);
        req.setSource("Delhi");
        req.setDestination("Mumbai");
        req.setRoutes(Arrays.asList("Delhi,Agra,Bhopal,Mumbai"));
        req.setArrivalTime(LocalTime.of(10, 0));
        req.setDepartureTime(LocalTime.of(8, 0));
        req.setAmount(1500);
        req.setDate(LocalDate.of(2025, 6, 23));

        when(trainRepository.save(any(TrainDetails.class))).thenAnswer(i -> i.getArgument(0));

        TrainDetails result = trainService.addTrain(req);

        assertEquals("Train added successfully", result);
        verify(trainRepository).save(any(TrainDetails.class));
    }

    // --- getAllTrains ---
    @Test
    void getAllTrains_returnsList() {
        TrainDetails t1 = new TrainDetails();
        t1.setTrainName("Rajdhani Express");
        TrainDetails t2 = new TrainDetails();
        t2.setTrainName("Shatabdi Express");
        List<TrainDetails> trains = Arrays.asList(t1, t2);

        when(trainRepository.findAll()).thenReturn(trains);

        List<TrainDetails> result = trainService.getAllTrains();
        assertEquals(2, result.size());
        assertEquals("Rajdhani Express", result.get(0).getTrainName());
        assertEquals("Shatabdi Express", result.get(1).getTrainName());
    }

    // --- searchTrains ---
    @Test
    void searchTrains_returnsMatchingTrains() {
        TrainDetails t1 = new TrainDetails();
        t1.setTrainName("Rajdhani Express");
        when(trainRepository.findBytrainNameStartingWithIgnoreCase("Raj")).thenReturn(List.of(t1));

        List<TrainDetails> result = trainService.searchTrains("Raj");
        assertEquals(1, result.size());
        assertEquals("Rajdhani Express", result.get(0).getTrainName());
    }

    // --- updateTrain ---
    @Test
    void updateTrain_success() throws TrainException {
        TrainDetails existing = new TrainDetails();
        existing.setTrainId(1L);
        existing.setTrainName("Old Name");
        existing.setTotalSeats(100);

        TrainDetails update = new TrainDetails();
        update.setTrainName("New Name");
        update.setTotalSeats(120);
        update.setSource("Delhi");
        update.setDestination("Mumbai");
        update.setRoutes(Arrays.asList("Delhi,Mumbai"));
        update.setArrivalTime(LocalTime.of(10, 0));
        update.setDepartureTime(LocalTime.of(8, 0));
        update.setAmount(2000);
        update.setDate(LocalDate.of(2025, 6, 23));

        when(trainRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(trainRepository.save(any(TrainDetails.class))).thenAnswer(i -> i.getArgument(0));

        TrainDetails result = trainService.updateTrain(1L, update);

        assertEquals("New Name", result.getTrainName());
        assertEquals(120, result.getTotalSeats());
        assertEquals("Delhi", result.getSource());
        assertEquals("Mumbai", result.getDestination());
    }

    @Test
    void updateTrain_notFound_throwsException() {
        when(trainRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(TrainException.class, () -> trainService.updateTrain(1L, new TrainDetails()));
    }

    // --- deleteTrain ---
    @Test
    void deleteTrain_success() throws TrainException {
        TrainDetails t = new TrainDetails();
        t.setTrainId(1L);
        when(trainRepository.findById(1L)).thenReturn(Optional.of(t));
        doNothing().when(trainRepository).deleteById(1L);

        assertDoesNotThrow(() -> trainService.deleteTrain(1L));
        verify(trainRepository).deleteById(1L);
    }

    @Test
    void deleteTrain_notFound_throwsException() {
        when(trainRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(TrainException.class, () -> trainService.deleteTrain(1L));
    }

    // --- getTrainById ---
    @Test
    void getTrainById_success() throws TrainException {
        TrainDetails t = new TrainDetails();
        t.setTrainId(1L);
        t.setTrainName("Rajdhani Express");
        when(trainRepository.findById(1L)).thenReturn(Optional.of(t));

        TrainDetails result = trainService.getTrainById(1L);
        assertEquals(1L, result.getTrainId());
        assertEquals("Rajdhani Express", result.getTrainName());
    }

    @Test
    void getTrainById_notFound_throwsException() {
        when(trainRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(TrainException.class, () -> trainService.getTrainById(1L));
    }

    // --- getTodayTrains ---
    @Test
    void getTodayTrains_returnsList() {
        TrainDetails t = new TrainDetails();
        t.setTrainName("Today Express");
        when(trainRepository.findBydepartureTime(LocalDate.now())).thenReturn(List.of(t));

        List<TrainDetails> result = trainService.getTodayTrains();
        assertEquals(1, result.size());
        assertEquals("Today Express", result.get(0).getTrainName());
    }

    // --- getTrainsByDate ---
    @Test
    void getTrainsByDate_returnsList() {
        LocalDate date = LocalDate.of(2025, 6, 23);
        TrainDetails t = new TrainDetails();
        t.setTrainName("Date Express");
        when(trainRepository.findBydepartureTime(date)).thenReturn(List.of(t));

        List<TrainDetails> result = trainService.getTrainsByDate(date);
        assertEquals(1, result.size());
        assertEquals("Date Express", result.get(0).getTrainName());
    }

    // --- getTrainsBySourceAndDestination ---
    @Test
    void getTrainsBySourceAndDestination_returnsList() {
        TrainDetails t = new TrainDetails();
        t.setTrainName("Route Express");
        when(trainRepository.findBySourceAndDestination("Delhi", "Mumbai")).thenReturn(List.of(t));

        List<TrainDetails> result = trainService.getTrainsBySourceAndDestination("Delhi", "Mumbai");
        assertEquals(1, result.size());
        assertEquals("Route Express", result.get(0).getTrainName());
    }

    // --- decreaseSeats ---
    @Test
    void decreaseSeats_success() {
        TrainDetails t = new TrainDetails();
        t.setTrainId(1L);
        t.setTotalSeats(100);
        when(trainRepository.findById(1L)).thenReturn(Optional.of(t));
        when(trainRepository.save(any(TrainDetails.class))).thenAnswer(i -> i.getArgument(0));

        String result = trainService.decreaseSeats(1L, 10);
        assertEquals("Seats updated successfully", result);
        assertEquals(90, t.getTotalSeats());
    }

    @Test
    void decreaseSeats_notEnoughSeats_throwsException() {
        TrainDetails t = new TrainDetails();
        t.setTrainId(1L);
        t.setTotalSeats(5);
        when(trainRepository.findById(1L)).thenReturn(Optional.of(t));

        assertThrows(RuntimeException.class, () -> trainService.decreaseSeats(1L, 10));
    }

    @Test
    void decreaseSeats_trainNotFound_throwsException() {
        when(trainRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> trainService.decreaseSeats(1L, 1));
    }

    // --- increaseSeats ---
    @Test
    void increaseSeats_success() {
        TrainDetails t = new TrainDetails();
        t.setTrainId(1L);
        t.setTotalSeats(50);
        when(trainRepository.findById(1L)).thenReturn(Optional.of(t));
        when(trainRepository.save(any(TrainDetails.class))).thenAnswer(i -> i.getArgument(0));

        String result = trainService.increaseSeats(1L, 20);
        assertEquals("Seats updated successfully", result);
        assertEquals(70, t.getTotalSeats());
    }

    @Test
    void increaseSeats_trainNotFound_throwsException() {
        when(trainRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> trainService.increaseSeats(1L, 10));
    }
}