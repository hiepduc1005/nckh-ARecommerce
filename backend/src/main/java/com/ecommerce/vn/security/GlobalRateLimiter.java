package com.ecommerce.vn.security;

import java.time.Duration;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;


public class GlobalRateLimiter {
	private final Bucket bucket;
	
	public GlobalRateLimiter() {
		Bandwidth limit = Bandwidth.builder()
                .capacity(100) // Dung lượng tối đa 100 token
                .refillGreedy(100, Duration.ofMinutes(1)) // Làm mới 100 token mỗi phút
                .build();
		this.bucket = Bucket.builder().addLimit(limit).build();
	}
	
	public boolean tryConsume() {
        return bucket.tryConsume(1); // Mỗi request tiêu thụ 1 token
    }
}
