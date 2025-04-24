package com.ecommerce.vn.security;

import java.io.IOException;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class IPRateLimitFilter extends OncePerRequestFilter {
    private final RateLimiterPerIp rateLimiterPerIP;

    public IPRateLimitFilter() {
        this.rateLimiterPerIP = new RateLimiterPerIp();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String clientIp = request.getRemoteAddr();
        try {
            if (rateLimiterPerIP.resolveBucket(clientIp).tryConsume(1)) {
                filterChain.doFilter(request, response);
            } else {
                response.setStatus(429);
                response.getWriter().write("Too many requests from your IP (IP limit exceeded)");
            }
        } catch (ExecutionException e) {
            response.setStatus(500);
            response.getWriter().write("Internal server error while processing rate limit");
            e.printStackTrace();
        }
    }
}