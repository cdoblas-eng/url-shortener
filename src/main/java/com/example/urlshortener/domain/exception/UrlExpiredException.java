package com.example.urlshortener.domain.exception;

public class UrlExpiredException extends RuntimeException {

    public UrlExpiredException(String shortCode) {
        super("The shortened URL link '/" + shortCode + "' has expired and is no longer available.");
    }
}
