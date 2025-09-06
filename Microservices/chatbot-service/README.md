# Chatbot Service

This is a microservice for the Railway Reservation System that provides a chatbot to assist passengers with common queries.

## Features

- Rule-based responses for common questions about booking tickets, payments, cancellations, etc.
- Optional integration with OpenAI for more advanced AI responses
- REST API endpoint for chat interactions
- Eureka service discovery

## API Endpoint

- POST `/api/chatbot/chat`
  - Body: `{"message": "your question"}`
  - Response: `{"response": "answer"}`

## Configuration

### Rule-based Mode (Default)
The service works out of the box with predefined responses for common questions.

### OpenAI Integration (Optional)
To enable AI responses:
1. Get a free API key from [OpenAI](https://platform.openai.com/)
2. Update `application.yml`:
   ```yaml
   openai:
     api-key: your-actual-api-key-here
   ```

## Running the Service

1. Ensure Eureka server is running
2. Run: `mvn spring-boot:run`
3. The service will be available on port 8085

## Common Questions Handled

- How to book tickets
- Payment methods
- Ticket cancellation and refunds
- PNR status
- Train schedules
- Seat availability
- Login and registration
- Contact information
