package com.example.urlshortener.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "url_mappings", indexes = {
    @Index(name = "idx_short_code", columnList = "shortCode")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UrlMappingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2048)
    private String originalUrl;

    @Column(unique = true, length = 10)
    private String shortCode;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private long clickCount;
}
