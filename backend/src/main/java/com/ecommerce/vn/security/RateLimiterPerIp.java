package com.ecommerce.vn.security;

import java.time.Duration;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;

public class RateLimiterPerIp {
	private final Cache<String, Bucket> cache;

    public RateLimiterPerIp() {
        this.cache = CacheBuilder.newBuilder()
                .expireAfterAccess(1, TimeUnit.HOURS)
                .build();
    }

    public Bucket resolveBucket(String ip) throws ExecutionException {
        return cache.get(ip, () -> {
        	Bandwidth limit = Bandwidth.builder()
                    .capacity(30) 
                    .refillIntervally(30, Duration.ofMinutes(5)) 
                    .build();
            return Bucket.builder().addLimit(limit).build();
        });
    }
}
