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
public class ClickEvent {
    private String shortCode;
    private String ipAddress;
    private String userAgent;
    private LocalDateTime timestamp;
}
