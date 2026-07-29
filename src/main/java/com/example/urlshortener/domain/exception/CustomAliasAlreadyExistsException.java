package com.example.urlshortener.domain.exception;

public class CustomAliasAlreadyExistsException extends RuntimeException {
    public CustomAliasAlreadyExistsException(String alias) {
        super("Custom alias '" + alias + "' is already in use. Please choose another one.");
    }
}
