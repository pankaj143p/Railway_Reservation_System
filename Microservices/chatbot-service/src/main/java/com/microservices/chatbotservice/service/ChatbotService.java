package com.microservices.chatbotservice.service;

import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatMessageRole;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatbotService {

    private Map<String, String> responses;
    private OpenAiService openAiService;

    @Value("${openai.api-key}")
    private String openAiApiKey;

    public ChatbotService() {
        responses = new HashMap<>();
        initializeResponses();
    }

    @PostConstruct
    public void initializeOpenAiService() {
        System.out.println("Initializing OpenAI service...");
        System.out.println("API Key present: " + (openAiApiKey != null));
        System.out.println("API Key starts with sk- or sk-proj-: " + (openAiApiKey != null && (openAiApiKey.startsWith("sk-") || openAiApiKey.startsWith("sk-proj-"))));
        System.out.println("API Key length: " + (openAiApiKey != null ? openAiApiKey.length() : 0));
        
        if (openAiApiKey != null && !openAiApiKey.trim().isEmpty() && (openAiApiKey.startsWith("sk-") || openAiApiKey.startsWith("sk-proj-"))) {
            try {
                openAiService = new OpenAiService(openAiApiKey, Duration.ofSeconds(30));
                System.out.println("OpenAI service initialized successfully");
            } catch (Exception e) {
                System.err.println("Failed to initialize OpenAI service: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("OpenAI API key not configured properly, using rule-based responses only");
        }
    }

    private void initializeResponses() {
        // Railway-specific responses
        responses.put("how to book ticket", "To book a ticket, log in to your account, search for trains by entering source and destination, select your preferred train and class, choose seats, and proceed to payment.");
        responses.put("book ticket", "To book a ticket, log in to your account, search for trains by entering source and destination, select your preferred train and class, choose seats, and proceed to payment.");
        responses.put("how do i book", "To book a ticket, log in to your account, search for trains by entering source and destination, select your preferred train and class, choose seats, and proceed to payment.");
        responses.put("how to pay", "You can pay using credit card, debit card, UPI, or net banking. We support secure payments through our payment gateway.");
        responses.put("payment", "You can pay using credit card, debit card, UPI, or net banking. We support secure payments through our payment gateway.");
        responses.put("how do i pay", "You can pay using credit card, debit card, UPI, or net banking. We support secure payments through our payment gateway.");
        responses.put("cancel ticket", "To cancel a ticket, go to 'My Bookings', select the ticket, and click 'Cancel'. Refunds will be processed as per our policy.");
        responses.put("how to cancel", "To cancel a ticket, go to 'My Bookings', select the ticket, and click 'Cancel'. Refunds will be processed as per our policy.");
        responses.put("refund", "Refunds are processed within 5-7 business days. The amount depends on the cancellation time before departure.");
        responses.put("pnr status", "Check your PNR status by entering your PNR number in the 'PNR Enquiry' section.");
        responses.put("pnr", "Check your PNR status by entering your PNR number in the 'PNR Enquiry' section.");
        responses.put("train schedule", "View train schedules by searching for trains between stations or check the timetable on our website.");
        responses.put("schedule", "View train schedules by searching for trains between stations or check the timetable on our website.");
        responses.put("seat availability", "Check seat availability by searching for trains and selecting your preferred date and class.");
        responses.put("seats", "Check seat availability by searching for trains and selecting your preferred date and class.");
        responses.put("login", "To log in, click on 'Login' and enter your registered email and password. If you don't have an account, sign up first.");
        responses.put("register", "To register, click on 'Sign Up', fill in your details like name, email, phone, and create a password.");
        responses.put("sign up", "To register, click on 'Sign Up', fill in your details like name, email, phone, and create a password.");
        responses.put("forgot password", "Click on 'Forgot Password', enter your email, and follow the instructions to reset your password.");
        responses.put("contact", "You can contact us at support@railway.com or call our helpline at 1800-XXX-XXXX.");
        responses.put("help", "I'm here to help! Ask me about booking tickets, payments, cancellations, or any questions you have.");
        
        // Remove external information responses - let OpenAI handle them
    }

    public String getResponse(String message) {
        if (message == null || message.trim().isEmpty()) {
            return "Please ask a question about our railway reservation system.";
        }

        String lowerMessage = message.toLowerCase();

        // Check for rule-based responses first
        for (Map.Entry<String, String> entry : responses.entrySet()) {
            if (lowerMessage.contains(entry.getKey())) {
                return entry.getValue();
            }
        }

        // Try partial matching for better results
        String[] words = lowerMessage.split("\\s+");
        for (String word : words) {
            if (word.length() > 2) { // Only check words longer than 2 characters
                for (Map.Entry<String, String> entry : responses.entrySet()) {
                    if (entry.getKey().contains(word) || word.contains(entry.getKey())) {
                        return entry.getValue();
                    }
                }
            }
        }

        // If OpenAI is configured, use it for more advanced responses
        if (openAiService != null) {
            System.out.println("Using OpenAI for response: " + message);
            return getOpenAiResponse(message);
        }

        System.out.println("Using fallback response for: " + message);
        return "I'm here to help with railway reservations and general questions. For specialized information, consider using dedicated apps or websites. How can I assist you with your train travel needs today?";
    }

    private String getOpenAiResponse(String message) {
        try {
            System.out.println("Calling OpenAI API for: " + message);
            System.out.println("OpenAI service is null: " + (openAiService == null));
            
            if (openAiService == null) {
                System.err.println("OpenAI service is null, cannot make API call");
                return "Sorry, I'm having trouble processing your request. Please try again.";
            }
            
            List<ChatMessage> messages = new ArrayList<>();
            messages.add(new ChatMessage(ChatMessageRole.SYSTEM.value(),
                "You are a helpful railway assistant chatbot. You can answer questions about train bookings, payments, cancellations, schedules, and railway services. For general questions about weather, news, sports, or other topics, provide helpful information while reminding users that you're primarily here to help with railway reservations. Keep responses concise and friendly."));
            messages.add(new ChatMessage(ChatMessageRole.USER.value(), message));

            ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(messages)
                .maxTokens(150)
                .temperature(0.7)
                .build();

            System.out.println("Making OpenAI API request...");
            ChatCompletionResult result = openAiService.createChatCompletion(request);
            String response = result.getChoices().get(0).getMessage().getContent().trim();
            System.out.println("OpenAI response: " + response);
            return response;
        } catch (Exception e) {
            System.err.println("OpenAI API error: " + e.getMessage());
            
            // Handle quota exceeded error specifically
            if (e.getMessage() != null && e.getMessage().contains("quota")) {
                System.out.println("OpenAI quota exceeded, falling back to rule-based responses");
                return "I'm currently using my basic responses due to high demand. For railway questions, I can help with booking tickets, payments, and cancellations. For other topics, please use specialized apps or websites for the most accurate information.";
            }
            
            return "Sorry, I'm having trouble processing your request. Please try again.";
        }
    }
}
