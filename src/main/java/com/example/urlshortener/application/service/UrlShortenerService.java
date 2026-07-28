package com.example.urlshortener.application.service;

import com.example.urlshortener.domain.model.ClickEvent;
import com.example.urlshortener.domain.model.UrlMapping;
import com.example.urlshortener.domain.port.out.CachePort;
import com.example.urlshortener.domain.port.out.EventPublisherPort;
import com.example.urlshortener.domain.port.out.UrlRepositoryPort;
import com.example.urlshortener.domain.util.Base62Encoder;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UrlShortenerService {

    private final UrlRepositoryPort urlRepository;
    private final CachePort cachePort;
    private final EventPublisherPort eventPublisher;

    public UrlMapping shortenUrl(String originalUrl) {
        UrlMapping initialMapping = UrlMapping.builder()
                .originalUrl(originalUrl)
                .createdAt(LocalDateTime.now(ZoneId.systemDefault()))
                .clickCount(0)
                .build();

        UrlMapping savedMapping = urlRepository.save(initialMapping);
        String shortCode = Base62Encoder.encode(savedMapping.getId());
        savedMapping.setShortCode(shortCode);

        UrlMapping updated = urlRepository.save(savedMapping);

        // Populate Cache
        cachePort.put(shortCode, originalUrl);

        return updated;
    }

    public Optional<String> getOriginalUrlAndTrackClick(String shortCode, String ipAddress, String userAgent) {
        // 1. Check Redis Cache
        Optional<String> cachedUrl = cachePort.get(shortCode);
        if (cachedUrl.isPresent()) {
            publishClickAsync(shortCode, ipAddress, userAgent);
            return cachedUrl;
        }

        // 2. Cache Miss -> Check DB
        Optional<UrlMapping> dbMapping = urlRepository.findByShortCode(shortCode);
        if (dbMapping.isPresent()) {
            String originalUrl = dbMapping.get().getOriginalUrl();
            cachePort.put(shortCode, originalUrl);
            publishClickAsync(shortCode, ipAddress, userAgent);
            return Optional.of(originalUrl);
        }

        return Optional.empty();
    }

    private void publishClickAsync(String shortCode, String ipAddress, String userAgent) {
        ClickEvent event = ClickEvent.builder()
                .shortCode(shortCode)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .timestamp(LocalDateTime.now(ZoneId.systemDefault()))
                .build();
        eventPublisher.publishClickEvent(event);
    }
}
