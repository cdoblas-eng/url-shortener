package com.example.urlshortener.domain.exception;

public class InvalidCustomAliasException extends RuntimeException {
    public InvalidCustomAliasException(String message) {
        super(message);
    }
}
