package com.example.urlshortener.infrastructure.adapter.out.persistence;

import com.example.urlshortener.domain.model.UrlMapping;
import com.example.urlshortener.domain.port.out.UrlRepositoryPort;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class UrlRepositoryAdapter implements UrlRepositoryPort {

    private final SpringDataUrlRepository repository;

    @Override
    public UrlMapping save(UrlMapping urlMapping) {
        UrlMappingEntity entity = toEntity(urlMapping);
        UrlMappingEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<UrlMapping> findByShortCode(String shortCode) {
        return repository.findByShortCode(shortCode).map(this::toDomain);
    }

    @Override
    @Transactional
    public void incrementClickCount(String shortCode) {
        repository.incrementClickCount(shortCode);
    }

    @Override
    @Transactional
    public void deleteByShortCode(String shortCode) {
        repository.deleteByShortCode(shortCode);
    }

    private UrlMappingEntity toEntity(UrlMapping domain) {
        return UrlMappingEntity.builder()
                .id(domain.getId())
                .originalUrl(domain.getOriginalUrl())
                .shortCode(domain.getShortCode())
                .createdAt(domain.getCreatedAt())
                .expiresAt(domain.getExpiresAt())
                .clickCount(domain.getClickCount())
                .build();
    }

    private UrlMapping toDomain(UrlMappingEntity entity) {
        return UrlMapping.builder()
                .id(entity.getId())
                .originalUrl(entity.getOriginalUrl())
                .shortCode(entity.getShortCode())
                .createdAt(entity.getCreatedAt())
                .expiresAt(entity.getExpiresAt())
                .clickCount(entity.getClickCount())
                .build();
    }
}
