package com.example.urlshortener.infrastructure.adapter.out.cache;

import com.example.urlshortener.domain.port.out.CachePort;
import java.time.Duration;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RedisCacheAdapter implements CachePort {

    private final StringRedisTemplate redisTemplate;
    private static final Duration CACHE_TTL = Duration.ofDays(7);

    @Override
    public void put(String shortCode, String originalUrl) {
        redisTemplate.opsForValue().set("url:" + shortCode, originalUrl, CACHE_TTL);
    }

    @Override
    public Optional<String> get(String shortCode) {
        String value = redisTemplate.opsForValue().get("url:" + shortCode);
        return Optional.ofNullable(value);
    }
}
