# Real-time Seat Booking System Implementation

## Overview
This document outlines the complete implementation of a real-time seat booking system for the Railway Reservation System. The system allows seat booking by specific numbers with different classes and pricing similar to real-world train booking systems like IRCTC.

## Features Implemented

### 1. Seat Class Configuration
- **Sleeper Class**: Default 100 seats, ₹300 per seat
- **AC 2-Tier**: Default 40 seats, ₹700 per seat
- **AC 1st Class**: Default 30 seats, ₹1300 per seat
- **Ratio**: 50:20:30 (Sleeper:AC2:AC1) = 100:40:30 seats

### 2. Seat Numbering System
- **Sleeper**: Seats 1-100
- **AC2**: Seats 101-140 (sleeper_seats + 1 to sleeper_seats + ac2_seats)
- **AC1**: Seats 141-170 (sleeper_seats + ac2_seats + 1 to total_seats)

### 3. Real-time Booking Features
- ✅ Book specific seat numbers
- ✅ Real-time seat availability checking
- ✅ Class-wise seat management
- ✅ Automatic seat assignment if no preference
- ✅ Multi-seat booking (up to 6 seats at once)
- ✅ Seat conflict prevention
- ✅ Route-wise booking support

## Database Changes

### New Tables
1. **seat_bookings**: Stores individual seat bookings
2. **Enhanced trains table**: Added seat configuration and pricing columns

### New Columns in `trains` table
- `sleeper_seats` (INTEGER): Number of sleeper seats
- `ac2_seats` (INTEGER): Number of AC2 seats  
- `ac1_seats` (INTEGER): Number of AC1 seats
- `sleeper_price` (DECIMAL): Price per sleeper seat
- `ac2_price` (DECIMAL): Price per AC2 seat
- `ac1_price` (DECIMAL): Price per AC1 seat
- `total_seats` (COMPUTED): Auto-calculated total seats

### Database Functions
- `get_next_available_seat()`: Returns next available seat in a class
- `is_seat_available()`: Checks if specific seat is available
- Seat availability views for performance

## Backend Implementation

### New Entities
1. **SeatBooking**: Individual seat booking entity
2. **Enhanced TrainDetails**: Updated with seat configuration

### New DTOs
1. **SeatBookingRequest**: Booking request payload
2. **SeatBookingResponse**: Booking response with details
3. **SeatAvailabilityResponse**: Class-wise availability info
4. **SeatConfigurationResponse**: Train seat configuration

### New Services
1. **SeatBookingService**: Core booking logic
2. **SeatBookingServiceImpl**: Implementation with transaction support

### New Controllers
1. **SeatBookingController**: Complete seat booking API
2. **Enhanced TrainController**: Seat configuration management

## API Endpoints

### Seat Booking APIs
```
POST /api/seats/book - Book seats (auto-assign or preferred)
POST /api/seats/book-specific - Book specific seat number
GET /api/seats/availability/{trainId} - Get seat availability
GET /api/seats/check-availability - Check specific seat
GET /api/seats/next-available - Get next available seat
GET /api/seats/booked-seats - Get booked seat numbers
GET /api/seats/booking/{bookingId} - Get booking details
PUT /api/seats/cancel/{bookingId} - Cancel booking
GET /api/seats/passenger-bookings - Get passenger history
GET /api/seats/validate-seat - Validate seat for class
```

### Train Management APIs
```
PUT /trains/{id}/seat-config - Update seat configuration
PUT /trains/{id}/pricing - Update pricing
GET /trains/{id}/seat-config - Get seat configuration
```

## Frontend Implementation

### New Components
1. **SeatBooking**: Complete seat selection and booking UI
2. **Enhanced Calendar**: Integration with seat booking

### Key Features
- Visual seat map with real-time availability
- Class-wise seat selection (Sleeper/AC2/AC1)
- Multi-seat booking support
- Passenger details form
- Booking summary with pricing
- Real-time seat conflict prevention

## Business Logic

### Seat Assignment Rules
1. **Preferred Seat**: User can select specific seat numbers
2. **Auto Assignment**: System assigns next available seat if no preference
3. **Class Validation**: Seats are validated for their respective classes
4. **Conflict Prevention**: No two users can book the same seat
5. **Multi-seat Booking**: Up to 6 seats can be booked at once

### Pricing Logic
- Dynamic pricing based on seat class
- Total amount = (Number of seats × Price per seat)
- Admin can configure pricing per train

### Availability Logic
- Real-time checking before booking
- Class-wise availability display
- Booked seat visualization
- Date-wise seat management

## Security Features
- Transaction-based booking to prevent race conditions
- Unique constraint on seat bookings
- User authentication required for booking
- Input validation and sanitization

## Performance Optimizations
- Database indexes on frequently queried columns
- Efficient seat availability queries
- Cached seat configuration
- Optimized seat grid rendering

## Admin Features
- Configure seat counts per class
- Set pricing per class per train
- View booking reports
- Manage seat availability

## Migration Instructions

### Database Migration
1. Execute `database-seat-booking-migration.sql`
2. Verify all tables and functions are created
3. Update existing train data with default seat configuration

### Backend Deployment
1. Restart train-service after code deployment
2. Verify new endpoints are accessible
3. Test seat booking functionality

### Frontend Deployment
1. Deploy updated React components
2. Test seat selection interface
3. Verify real-time updates

## Testing Checklist

### Backend Testing
- [ ] Book specific seat number
- [ ] Auto-assign seat booking
- [ ] Multi-seat booking
- [ ] Seat availability checking
- [ ] Class validation
- [ ] Booking cancellation
- [ ] Passenger booking history

### Frontend Testing
- [ ] Seat map visualization
- [ ] Class switching
- [ ] Seat selection
- [ ] Booking form validation
- [ ] Real-time availability updates
- [ ] Mobile responsiveness

### Integration Testing
- [ ] End-to-end booking flow
- [ ] Real-time seat conflicts
- [ ] Payment integration
- [ ] Email notifications
- [ ] Booking confirmations

## Deployment Steps

### 1. Database Update
```sql
-- Execute database-seat-booking-migration.sql
-- This adds all necessary tables and columns
```

### 2. Backend Deployment
```bash
# Build and deploy train-service
mvn clean package
# Deploy JAR to server
```

### 3. Frontend Deployment
```bash
# Build React app
npm run build
# Deploy to web server
```

## Configuration

### Environment Variables
- `VITE_API_GATEWAY_URL`: Backend API URL
- Database connection strings
- JWT secret for authentication

### Default Configuration
- Sleeper seats: 100 (₹300)
- AC2 seats: 40 (₹700)  
- AC1 seats: 30 (₹1300)
- Max seats per booking: 6
- Booking advance period: 90 days

## Support and Maintenance

### Monitoring
- Track booking success rates
- Monitor seat utilization
- Performance metrics
- Error logging

### Maintenance Tasks
- Regular database cleanup
- Booking analytics
- Seat optimization
- Price adjustments

## Future Enhancements
- Dynamic pricing based on demand
- Seat preferences (window, aisle)
- Group booking features
- Waitlist management
- Mobile app integration

This implementation provides a complete real-time seat booking system similar to major railway booking platforms, with robust backend architecture and user-friendly frontend interface.
