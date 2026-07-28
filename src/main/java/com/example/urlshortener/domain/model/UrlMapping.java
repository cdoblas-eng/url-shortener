package com.example.urlshortener.domain.model;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UrlMapping {
    private Long id;
    private String originalUrl;
    private String shortCode;
    private LocalDateTime createdAt;
    private long clickCount;
}
