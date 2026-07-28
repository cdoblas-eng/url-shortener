package com.example.urlshortener.domain.port.out;

import java.util.Optional;

public interface CachePort {
    void put(String shortCode, String originalUrl);
    Optional<String> get(String shortCode);
}
