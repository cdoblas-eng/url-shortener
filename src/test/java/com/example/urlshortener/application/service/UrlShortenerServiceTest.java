package com.example.urlshortener.application.service;

import com.example.urlshortener.domain.exception.CustomAliasAlreadyExistsException;
import com.example.urlshortener.domain.exception.InvalidCustomAliasException;
import com.example.urlshortener.domain.model.ClickEvent;
import com.example.urlshortener.domain.model.UrlMapping;
import com.example.urlshortener.domain.port.out.CachePort;
import com.example.urlshortener.domain.port.out.EventPublisherPort;
import com.example.urlshortener.domain.port.out.UrlRepositoryPort;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UrlShortenerServiceTest {

    private FakeUrlRepository urlRepository;
    private FakeCachePort cachePort;
    private FakeEventPublisher eventPublisher;
    private UrlShortenerService urlShortenerService;

    @BeforeEach
    void setUp() {
        urlRepository = new FakeUrlRepository();
        cachePort = new FakeCachePort();
        eventPublisher = new FakeEventPublisher();
        urlShortenerService = new UrlShortenerService(urlRepository, cachePort, eventPublisher);
    }

    @Test
    void shortenUrl_withCustomAlias_success() {
        String originalUrl = "https://example.com/long-page";
        String customAlias = "my-custom-link";

        UrlMapping mapping = urlShortenerService.shortenUrl(originalUrl, customAlias);

        assertNotNull(mapping);
        assertEquals(customAlias, mapping.getShortCode());
        assertEquals(originalUrl, mapping.getOriginalUrl());
        assertEquals(Optional.of(originalUrl), cachePort.get(customAlias));
    }

    @Test
    void shortenUrl_withExistingCustomAliasInCache_throwsConflictException() {
        String originalUrl = "https://example.com/long-page";
        String customAlias = "taken-alias";
        cachePort.put(customAlias, "https://other.com");

        assertThrows(CustomAliasAlreadyExistsException.class, () ->
                urlShortenerService.shortenUrl(originalUrl, customAlias)
        );
    }

    @Test
    void shortenUrl_withReservedAlias_throwsInvalidAliasException() {
        String originalUrl = "https://example.com/long-page";
        String reservedAlias = "actuator";

        assertThrows(InvalidCustomAliasException.class, () ->
                urlShortenerService.shortenUrl(originalUrl, reservedAlias)
        );
    }

    @Test
    void shortenUrl_withInvalidFormatAlias_throwsInvalidAliasException() {
        String originalUrl = "https://example.com/long-page";
        String invalidAlias = "a!";

        assertThrows(InvalidCustomAliasException.class, () ->
                urlShortenerService.shortenUrl(originalUrl, invalidAlias)
        );
    }

    // --- Fake Test Implementations ---
    static class FakeUrlRepository implements UrlRepositoryPort {
        private final Map<String, UrlMapping> db = new HashMap<>();
        private long sequence = 1;

        @Override
        public UrlMapping save(UrlMapping mapping) {
            if (mapping.getId() == null) {
                mapping.setId(sequence++);
            }
            if (mapping.getShortCode() != null) {
                db.put(mapping.getShortCode(), mapping);
            }
            return mapping;
        }

        @Override
        public Optional<UrlMapping> findByShortCode(String shortCode) {
            return Optional.ofNullable(db.get(shortCode));
        }

        @Override
        public void incrementClickCount(String shortCode) {
            UrlMapping mapping = db.get(shortCode);
            if (mapping != null) {
                mapping.setClickCount(mapping.getClickCount() + 1);
            }
        }
    }

    static class FakeCachePort implements CachePort {
        private final Map<String, String> cache = new HashMap<>();

        @Override
        public Optional<String> get(String shortCode) {
            return Optional.ofNullable(cache.get(shortCode));
        }

        @Override
        public void put(String shortCode, String originalUrl) {
            cache.put(shortCode, originalUrl);
        }
    }

    static class FakeEventPublisher implements EventPublisherPort {
        @Override
        public void publishClickEvent(ClickEvent event) {
            // no-op for tests
        }
    }
}
