package com.example.urlshortener.infrastructure.adapter.out.messaging;

import com.example.urlshortener.domain.model.ClickEvent;
import com.example.urlshortener.domain.port.out.EventPublisherPort;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class KafkaEventPublisherAdapter implements EventPublisherPort {

    private static final String TOPIC_URL_CLICKS = "url-clicks";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Override
    @SneakyThrows
    public void publishClickEvent(ClickEvent event) {
        String jsonPayload = objectMapper.writeValueAsString(event);
        // Using shortCode as partitioning key to keep order per link
        kafkaTemplate.send(TOPIC_URL_CLICKS, event.getShortCode(), jsonPayload);
    }
}
