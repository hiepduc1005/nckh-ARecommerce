package com.ecommerce.vn.security;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class GlobalRateLimitFilter extends OncePerRequestFilter{

	private final GlobalRateLimiter rateLimiter;
	
	public GlobalRateLimitFilter() {
        this.rateLimiter = new GlobalRateLimiter();
    }
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		if(rateLimiter.tryConsume()) {
			filterChain.doFilter(request, response);
		}else {
			response.setStatus(429);
			response.getWriter().write("Too many requests");
		}
	}
	

}
