package com.example.urlshortener.domain.port.out;

import com.example.urlshortener.domain.model.UrlMapping;
import java.util.Optional;

public interface UrlRepositoryPort {
    UrlMapping save(UrlMapping urlMapping);
    Optional<UrlMapping> findByShortCode(String shortCode);
    void incrementClickCount(String shortCode);
}
