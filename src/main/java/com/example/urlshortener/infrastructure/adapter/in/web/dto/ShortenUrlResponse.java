package com.example.urlshortener.infrastructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShortenUrlResponse {
    private String originalUrl;
    private String shortCode;
    private String shortUrl;
}
