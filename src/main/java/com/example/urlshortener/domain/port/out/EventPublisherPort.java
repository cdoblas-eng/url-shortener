package com.example.urlshortener.domain.port.out;

import com.example.urlshortener.domain.model.ClickEvent;

public interface EventPublisherPort {
    void publishClickEvent(ClickEvent event);
}
