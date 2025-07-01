# Railway Reservation System - Microservices Enhancement Summary

## Overview
Enhanced your existing microservices architecture to support the frontend booking system requirements.

## Services Enhanced

### 1. Train Service (Port 5010)

#### New DTOs Added:
- `TrainSearchParams.java` - For advanced search parameters
- `SeatAvailabilityResponse.java` - For seat availability responses

#### TrainDetails Model Enhanced:
- Added `availableSeats` field for tracking seat availability
- Added `operationalDays` field for day-wise operations

#### TrainService Interface Enhanced:
- `searchTrainsWithParams(TrainSearchParams)` - Advanced search
- `getAvailableSeats(Long trainId, LocalDate date)` - Get available seats
- `checkSeatAvailability(Long trainId, LocalDate, Integer seats)` - Check availability

#### TrainRepository Enhanced:
- `findTrainsForSearch()` - Date range and route search
- `findByDateRange()` - Search by date range

#### TrainController Enhanced:
- `GET /trains/search/advanced` - Advanced search with multiple parameters
- `GET /trains/{trainId}/seats/{date}` - Get available seats
- `GET /trains/{trainId}/availability` - Check seat availability

#### CORS Configuration:
- Added CorsConfig.java for frontend integration

### 2. Ticket Service (Port 5100)

#### New DTOs Added:
- `BookingFormData.java` - Frontend-compatible booking request
- `BookingResponse.java` - Frontend-compatible booking response
- `CancellationResponse.java` - Cancellation response format

#### TicketBooking Model Enhanced:
- Added `travelDate` field
- Added `seatNumber` field
- Added `gender` field
- Added `seatType` and `mealPreference` fields

#### TicketController Enhanced:
- `POST /tickets/book/{trainId}` - New booking endpoint (frontend format)
- `GET /tickets/user` - Get user tickets (auth header)
- `POST /tickets/{ticketId}/cancel` - New cancellation endpoint

#### CORS Configuration:
- Added CorsConfig.java for frontend integration

### 3. Frontend Integration

#### Updated trainService.ts:
- Updated API URLs to use microservice endpoints:
  - Train Service: `http://localhost:6111`
  - Ticket Service: `http://localhost:5100`
- Modified endpoints to match new controller paths
- Enhanced search to use advanced search endpoint

## Service Ports

| Service | Port | Database |
|---------|------|----------|
| Train Service | 5010 | traindb |
| Ticket Service | 5100 | ticketdb |
| User Service | 5000 | userdb |
| Payment Service | 5050 | paymentdb |
| Admin Service | 5020 | admindb |

## New API Endpoints

### Train Service (http://localhost:6111)
```
GET /trains/all - Get all trains
GET /trains/search/advanced - Advanced search with date range
GET /trains/{trainId}/seats/{date} - Get available seats
GET /trains/{trainId}/availability - Check seat availability
POST /trains/add - Add new train
PUT /trains/update/{id} - Update train
DELETE /trains/delete/{id} - Delete train
```

### Ticket Service (http://localhost:5100)
```
POST /tickets/book/{trainId} - Book ticket (new format)
GET /tickets/user - Get user tickets
POST /tickets/{ticketId}/cancel - Cancel ticket (new format)
GET /tickets/{ticketId} - Get ticket details
```

## Database Schema Updates Required

### TrainDetails Table:
```sql
ALTER TABLE train_details ADD COLUMN available_seats INTEGER;
ALTER TABLE train_details ADD COLUMN operational_days TEXT[];
```

### TicketBooking Table:
```sql
ALTER TABLE ticket_booking ADD COLUMN travel_date DATE;
ALTER TABLE ticket_booking ADD COLUMN seat_number VARCHAR(50);
ALTER TABLE ticket_booking ADD COLUMN gender VARCHAR(20);
ALTER TABLE ticket_booking ADD COLUMN seat_type VARCHAR(20);
ALTER TABLE ticket_booking ADD COLUMN meal_preference VARCHAR(20);
```

## Running the Services

1. **Start Train Service:**
   ```bash
   cd Microservices/train-service
   mvn spring-boot:run
   ```

2. **Start Ticket Service:**
   ```bash
   cd Microservices/ticket-service
   mvn spring-boot:run
   ```

3. **Start Frontend:**
   ```bash
   npm run dev
   ```

## Key Features Added

✅ **Advanced Train Search** - Search by source, destination, and date range
✅ **Seat Availability Checking** - Real-time seat availability
✅ **Enhanced Booking** - Support for passenger details and preferences
✅ **User Ticket Management** - View and cancel user tickets
✅ **CORS Support** - Frontend integration enabled
✅ **Frontend Compatibility** - DTOs match frontend interfaces

## Testing the Integration

1. **Search Trains:**
   ```
   GET http://localhost:6111/trains/search/advanced?source=Mumbai&destination=Delhi&fromDate=2025-07-01
   ```

2. **Check Availability:**
   ```
   GET http://localhost:6111/trains/1/availability?date=2025-07-01&seats=2
   ```

3. **Book Ticket:**
   ```
   POST http://localhost:5100/tickets/book/1
   Body: BookingFormData JSON
   ```

4. **Get User Tickets:**
   ```
   GET http://localhost:5100/tickets/user
   Header: User-Email: user@example.com
   ```

## Notes

- Services use PostgreSQL databases (configure connection strings)
- CORS is configured for localhost:5173 (Vite dev server)
- Authentication headers should be implemented for production
- Payment integration can be added to the booking flow
- Consider adding API Gateway for unified endpoints in production
