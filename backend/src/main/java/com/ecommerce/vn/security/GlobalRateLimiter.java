package com.ecommerce.vn.security;

import java.time.Duration;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;


public class GlobalRateLimiter {
	private final Bucket bucket;
	
	public GlobalRateLimiter() {
		Bandwidth limit = Bandwidth.builder()
                .capacity(10000) 
                .refillGreedy(10000, Duration.ofMinutes(1)) 
                .build();
		this.bucket = Bucket.builder().addLimit(limit).build();
	}
	
	public boolean tryConsume() {
        return bucket.tryConsume(1);
    }
}
