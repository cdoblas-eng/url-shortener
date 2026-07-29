package com.example.urlshortener.infrastructure.adapter.in.web;

import com.example.urlshortener.application.service.UrlShortenerService;
import com.example.urlshortener.domain.model.UrlMapping;
import com.example.urlshortener.infrastructure.adapter.in.web.dto.ShortenUrlRequest;
import com.example.urlshortener.infrastructure.adapter.in.web.dto.ShortenUrlResponse;
import jakarta.servlet.http.HttpServletRequest;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class UrlController {

    private final UrlShortenerService urlShortenerService;

    @PostMapping({"/api/v1/urls", "/api/v1/urls/shorten"})
    public ResponseEntity<ShortenUrlResponse> shortenUrl(@RequestBody ShortenUrlRequest request, HttpServletRequest httpRequest) {
        UrlMapping mapping = urlShortenerService.shortenUrl(request.getOriginalUrl(), request.getCustomAlias());
        String baseUrl = httpRequest.getRequestURL().toString().replace(httpRequest.getRequestURI(), "");
        String shortUrl = baseUrl + "/" + mapping.getShortCode();

        ShortenUrlResponse response = ShortenUrlResponse.builder()
                .originalUrl(mapping.getOriginalUrl())
                .shortCode(mapping.getShortCode())
                .shortUrl(shortUrl)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirectToOriginalUrl(
            @PathVariable String shortCode,
            HttpServletRequest request) {

        String ipAddress = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");

        return urlShortenerService.getOriginalUrlAndTrackClick(shortCode, ipAddress, userAgent)
                .map(originalUrl -> ResponseEntity.status(HttpStatus.FOUND)
                        .location(URI.create(originalUrl))
                        .<Void>build())
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
