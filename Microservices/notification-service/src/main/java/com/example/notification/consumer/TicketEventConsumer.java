package com.example.notification.consumer;

import com.example.notification.model.TicketEvent;
import com.example.notification.service.EmailService;
import com.example.notification.util.PdfGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class TicketEventConsumer {

    @Autowired
    private EmailService emailService;

    @KafkaListener(
            topics = "ticket-booked",
            groupId = "notification-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consume(TicketEvent event) {
        try {
            String subject = "Your Train Ticket is Confirmed";
            String body = String.format(
                    "Hello,\n\n" +
                            "Your ticket (ID: %s) for train %s on %s has been booked successfully.\n\n" +
                            "Please keep this email for your reference.\n\n" +
                            "Thank you for booking with us.\n\n" +
                            "Best regards,\n" +
                            "Railway Booking Team",
                    event.getTicketNumber(), event.getTrainName(), event.getDepartureTime()
            );

            // Generate PDF with ticket details
            byte[] pdf = PdfGenerator.generateTicketPdf(event);

            // Send email with PDF attachment
            emailService.sendTicketWithPdf(event.getEmail(), subject, body, pdf);

            System.out.println("Email sent to: " + event.getEmail());

        } catch (Exception e) {
            System.err.println("Error processing Kafka message: " + e.getMessage());
            e.printStackTrace();
        }
    }
}