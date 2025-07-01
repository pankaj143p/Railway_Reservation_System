// package com.microservices.component;
//
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.kafka.core.KafkaTemplate;
// import org.springframework.stereotype.Component;
//
// import java.util.HashMap;
// import java.util.Map;
//
// @Component
// public class KafkaProducerService {
//
//     @Autowired
//     private KafkaTemplate<String, Object> kafkaTemplate;
//
//     private static final String TOPIC = "ticket-booked";
//
//     public void sendTicketBookedEvent(String email, String ticketId, String train, String date) {
//         Map<String, Object> message = new HashMap<>();
//         message.put("email", email);
//         message.put("ticketId", ticketId);
//         message.put("train", train);
//         message.put("date", date);
//
//         kafkaTemplate.send(TOPIC, message);
//     }
// }


package com.microservices.component;

import com.microservices.dto.TicketBookedEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaProducerService {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    private static final String TOPIC = "ticket-booked";

    public void sendTicketBookedEvent(TicketBookedEvent event) {
        kafkaTemplate.send(TOPIC, event);
    }
}