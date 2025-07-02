# Railway Reservation System - Payment Refund Implementation

## Overview
This document describes the complete implementation of payment refunds via Razorpay when users cancel train tickets in the Railway Reservation System.

## Features Implemented

### 1. Backend Changes

#### A. Ticket Service Enhancements

**Added Refund Support to TicketBooking Model:**
- Added `paymentId` field to store Razorpay payment IDs for refund processing
- Enhanced entity to support refund tracking

**Enhanced TicketServiceImplementation:**
- Modified `bookTicket()` to store `paymentId` during booking
- Added `cancelTicketWithRefund()` method that:
  - Cancels the ticket
  - Calls payment service to process Razorpay refund
  - Returns detailed cancellation and refund status
- Maintains backward compatibility with existing `cancelTicket()` method

**New DTOs:**
- `CancellationResponseDTO`: Comprehensive response with cancellation and refund details
  - Contains ticket cancellation status
  - Includes refund information (success/failure, refund ID, amount)
  - Provides user-friendly messages

**Enhanced PaymentClient (Feign):**
- Added `refundPayment()` method to call payment service refund endpoint
- Integrated with ticket cancellation workflow

**Updated TicketController:**
- Added new endpoint: `PUT /tickets/cancel-with-refund/{ticketId}`
- Returns detailed cancellation and refund information
- Maintains existing cancellation endpoint for backward compatibility

#### B. API Gateway Configuration
- Routes configured to handle refund requests
- Proper authentication filters applied
- CORS enabled for frontend integration

### 2. Frontend Changes

#### A. New Services
**CancellationService (`cancellationService.ts`):**
- Implements API calls to new refund-aware cancellation endpoint
- Handles authentication and error management
- Returns structured response with refund details

#### B. New Components
**CancellationModal (`CancellationModal.tsx`):**
- Interactive modal for ticket cancellation confirmation
- Displays ticket details before cancellation
- Shows refund processing status
- Provides real-time feedback on cancellation and refund results
- Includes loading states and error handling

#### C. Enhanced Pages
**BookedTickets Page (`bookedtickets.tsx`):**
- Updated to use new cancellation modal instead of simple API call
- Enhanced "Cancel" button to "Cancel & Refund"
- Integrated with CancellationModal for better user experience
- Real-time status updates after successful cancellation/refund

## Technical Implementation Details

### Backend Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway    │    │ Ticket Service  │
│                 │────│    (Port 6111)   │────│  (Port 5100)    │
│ Cancellation    │    │                  │    │                 │
│ Request         │    │ Authentication   │    │ Cancel Ticket + │
└─────────────────┘    │ & Routing        │    │ Refund Call     │
                       └──────────────────┘    └─────────────────┘
                                                        │
                                                        │ Feign Client
                                                        ▼
                                               ┌─────────────────┐
                                               │ Payment Service │
                                               │  (Port 5110)    │
                                               │                 │
                                               │ Razorpay Refund │
                                               │ Processing      │
                                               └─────────────────┘
```

### API Endpoints

#### New Endpoints Added:
1. `PUT /tickets/cancel-with-refund/{ticketId}` - Cancel ticket with refund processing
2. Frontend service integration via API Gateway at `http://localhost:6111`

#### Response Format:
```json
{
  "ticketId": 123,
  "cancellationStatus": "SUCCESS",
  "cancellationMessage": "Ticket cancelled successfully",
  "refundStatus": "SUCCESS",
  "refundMessage": "Refund initiated successfully",
  "refundId": "rfnd_xxx",
  "refundAmount": 1400,
  "refundAmountFormatted": "₹14.00"
}
```

### Frontend Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ BookedTickets   │    │ CancellationModal│    │ cancellationService│
│ Page            │────│                 │────│                 │
│                 │    │ - Confirmation  │    │ - API Calls     │
│ - Ticket List   │    │ - Progress      │    │ - Auth Handling │
│ - Cancel Button │    │ - Results       │    │ - Error Handling│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## User Experience Flow

1. **User Views Booked Tickets**
   - Navigate to "Booked Tickets" page
   - See list of all booked tickets with status

2. **Initiate Cancellation**
   - Click "Cancel & Refund" button on eligible tickets
   - Cancellation modal opens with ticket details

3. **Confirm Cancellation**
   - Review ticket information in modal
   - Click "Confirm Cancellation" to proceed
   - Modal shows loading state during processing

4. **View Results**
   - Real-time feedback on cancellation status
   - Refund processing status and details
   - Success/failure messages with actionable information

5. **Updated Status**
   - Ticket status automatically updates to "CANCELLED"
   - Modal can be closed after viewing results

## Error Handling

### Backend Error Scenarios:
- Ticket not found
- Ticket already cancelled
- Payment ID not available (pre-refund tickets)
- Razorpay API failures
- Network connectivity issues

### Frontend Error Handling:
- Network timeouts
- Authentication failures
- Invalid responses
- User-friendly error messages
- Graceful degradation

## Testing Strategy

### Backend Testing:
1. Unit tests for service methods
2. Integration tests for Feign client calls
3. Controller endpoint testing
4. Error scenario validation

### Frontend Testing:
1. Component testing for CancellationModal
2. Service testing for API calls
3. Integration testing for user flows
4. Error state testing

## Security Considerations

1. **Authentication**: All refund requests require valid JWT tokens
2. **Authorization**: Users can only cancel their own tickets
3. **Input Validation**: Ticket ID validation and sanitization
4. **Rate Limiting**: Prevent abuse of refund endpoints
5. **Audit Logging**: Track all cancellation and refund activities

## Performance Considerations

1. **Async Processing**: Refunds don't block the cancellation process
2. **Caching**: Ticket details cached during modal display
3. **Batching**: Future enhancement for bulk cancellations
4. **Monitoring**: Track refund success rates and processing times

## Future Enhancements

1. **Partial Refunds**: Support for partial amount refunds
2. **Refund Policies**: Time-based refund amount calculations
3. **Admin Interface**: Administrative refund management
4. **Notifications**: Email/SMS notifications for refund status
5. **Refund History**: Dedicated page for refund tracking
6. **Bulk Operations**: Cancel multiple tickets with refunds

## Configuration

### Environment Variables Required:
- `VITE_API_GATEWAY_URL`: Frontend API gateway URL
- Razorpay credentials in payment service
- Database configuration for all services

### Service Ports:
- API Gateway: 6111
- Ticket Service: 5100
- Payment Service: 5110
- User Service: 5001
- Train Service: 5010
- Eureka Server: 6010

## Deployment Notes

1. **Database Migration**: New `paymentId` field added to ticket_booking table
2. **Service Dependencies**: Ensure payment service is running before ticket service
3. **Frontend Build**: New components and services included in build
4. **API Gateway**: Updated routing configuration deployed

## Monitoring and Observability

### Metrics to Track:
- Refund success/failure rates
- Processing time for cancellations
- User engagement with new modal
- Error rates by type

### Logging:
- All refund requests logged with user context
- Error details captured for debugging
- Performance metrics tracked

## Conclusion

The payment refund functionality has been successfully integrated into the Railway Reservation System, providing users with a seamless experience for cancelling tickets and receiving refunds. The implementation maintains backward compatibility while adding comprehensive new features for modern user expectations.

The system is now production-ready with proper error handling, security measures, and user experience enhancements.
