package com.example.urlshortener.infrastructure.adapter.out.persistence;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface SpringDataUrlRepository extends JpaRepository<UrlMappingEntity, Long> {
    Optional<UrlMappingEntity> findByShortCode(String shortCode);

    @Modifying
    @Query("UPDATE UrlMappingEntity u SET u.clickCount = u.clickCount + 1 WHERE u.shortCode = :shortCode")
    void incrementClickCount(String shortCode);

    void deleteByShortCode(String shortCode);
}
