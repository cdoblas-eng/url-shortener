package com.example.urlshortener.infrastructure.adapter.out.messaging;

import com.example.urlshortener.domain.model.ClickEvent;
import com.example.urlshortener.domain.port.out.UrlRepositoryPort;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AnalyticsConsumer {

    private final UrlRepositoryPort urlRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "url-clicks", groupId = "url-analytics-group")
    @SneakyThrows
    public void consumeClickEvent(String message) {
        ClickEvent event = objectMapper.readValue(message, ClickEvent.class);
        log.info("Received click event for shortCode: {}, IP: {}", event.getShortCode(), event.getIpAddress());

        urlRepository.incrementClickCount(event.getShortCode());
    }
}
