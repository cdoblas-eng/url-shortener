package com.example.urlshortener.domain.port.out;

import java.util.Optional;

import java.time.Duration;

public interface CachePort {
    void put(String shortCode, String originalUrl);
    void put(String shortCode, String originalUrl, Duration ttl);
    Optional<String> get(String shortCode);
    void evict(String shortCode);
}
