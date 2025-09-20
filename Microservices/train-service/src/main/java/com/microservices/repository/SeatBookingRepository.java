package com.microservices.repository;

import com.microservices.model.SeatBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SeatBookingRepository extends JpaRepository<SeatBooking, Long> {

    // Find all bookings for a specific train and date
    List<SeatBooking> findByTrainIdAndBookingDate(Long trainId, LocalDate bookingDate);

    // Find bookings by train, date, and class
    List<SeatBooking> findByTrainIdAndBookingDateAndSeatClass(Long trainId, LocalDate bookingDate, String seatClass);

    // Find specific seat booking
    Optional<SeatBooking> findByTrainIdAndSeatNumberAndSeatClassAndBookingDate(
            Long trainId, Integer seatNumber, String seatClass, LocalDate bookingDate);

    // Check if a seat is available
    @Query("SELECT COUNT(sb) FROM SeatBooking sb WHERE sb.trainId = :trainId " +
           "AND sb.seatNumber = :seatNumber AND sb.seatClass = :seatClass " +
           "AND sb.bookingDate = :bookingDate AND sb.bookingStatus = 'CONFIRMED'")
    Long countConfirmedBookingsForSeat(@Param("trainId") Long trainId, 
                                      @Param("seatNumber") Integer seatNumber,
                                      @Param("seatClass") String seatClass, 
                                      @Param("bookingDate") LocalDate bookingDate);

    // Get booked seat numbers for a specific class
    @Query("SELECT sb.seatNumber FROM SeatBooking sb WHERE sb.trainId = :trainId " +
           "AND sb.bookingDate = :bookingDate AND sb.seatClass = :seatClass " +
           "AND sb.bookingStatus = 'CONFIRMED' ORDER BY sb.seatNumber")
    List<Integer> findBookedSeatNumbers(@Param("trainId") Long trainId, 
                                       @Param("bookingDate") LocalDate bookingDate,
                                       @Param("seatClass") String seatClass);

    // Count booked seats by class
    @Query("SELECT COUNT(sb) FROM SeatBooking sb WHERE sb.trainId = :trainId " +
           "AND sb.bookingDate = :bookingDate AND sb.seatClass = :seatClass " +
           "AND sb.bookingStatus = 'CONFIRMED'")
    Long countBookedSeatsByClass(@Param("trainId") Long trainId, 
                                @Param("bookingDate") LocalDate bookingDate,
                                @Param("seatClass") String seatClass);

    // Get next available seat number
    @Query(value = "SELECT get_next_available_seat(:trainId, :seatClass, :bookingDate)", nativeQuery = true)
    Integer getNextAvailableSeat(@Param("trainId") Long trainId, 
                                @Param("seatClass") String seatClass,
                                @Param("bookingDate") LocalDate bookingDate);

    // Check if seat is available using database function
    @Query(value = "SELECT is_seat_available(:trainId, :seatNumber, :seatClass, :bookingDate)", nativeQuery = true)
    Boolean isSeatAvailable(@Param("trainId") Long trainId, 
                           @Param("seatNumber") Integer seatNumber,
                           @Param("seatClass") String seatClass, 
                           @Param("bookingDate") LocalDate bookingDate);

    // Find all bookings by ticket ID
    List<SeatBooking> findByTicketId(Long ticketId);

    // Find all bookings for a passenger
    List<SeatBooking> findByPassengerEmailAndBookingStatus(String passengerEmail, String bookingStatus);

    // Get seat availability summary
    @Query("SELECT sb.seatClass, COUNT(sb) as bookedCount " +
           "FROM SeatBooking sb WHERE sb.trainId = :trainId " +
           "AND sb.bookingDate = :bookingDate AND sb.bookingStatus = 'CONFIRMED' " +
           "GROUP BY sb.seatClass")
    List<Object[]> getSeatAvailabilitySummary(@Param("trainId") Long trainId, 
                                             @Param("bookingDate") LocalDate bookingDate);

    // Cancel booking
    @Query("UPDATE SeatBooking sb SET sb.bookingStatus = 'CANCELLED' " +
           "WHERE sb.id = :bookingId")
    void cancelBooking(@Param("bookingId") Long bookingId);

    // Get passenger bookings history
    @Query("SELECT sb FROM SeatBooking sb WHERE sb.passengerEmail = :email " +
           "ORDER BY sb.bookingDate DESC, sb.createdAt DESC")
    List<SeatBooking> findPassengerBookingHistory(@Param("email") String email);
}
