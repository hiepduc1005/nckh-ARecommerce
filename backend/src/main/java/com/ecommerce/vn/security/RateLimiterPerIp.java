package com.ecommerce.vn.security;

import java.time.Duration;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;

public class RateLimiterPerIp {
    private static final long CAPACITY = 1000; // Dung lượng tối đa của bucket
    private final Cache<String, Bucket> cache;

    public RateLimiterPerIp() {
        this.cache = CacheBuilder.newBuilder()
                .expireAfterAccess(1, TimeUnit.HOURS)
                .build();
    }

    public Bucket resolveBucket(String ip) throws ExecutionException {
        return cache.get(ip, () -> {
            Bandwidth limit = Bandwidth.builder()
                    .capacity(CAPACITY)
                    .refillIntervally(1000, Duration.ofMinutes(5))
                    .build();
            return Bucket.builder().addLimit(limit).build();
        });
    }

    // Phương thức mới để lấy số request đã gửi cho một IP
    public long getRequestCount(String ip) throws ExecutionException {
        Bucket bucket = resolveBucket(ip);
        long availableTokens = bucket.getAvailableTokens();
        long requestCount = CAPACITY - availableTokens;
        return requestCount;
    }
}