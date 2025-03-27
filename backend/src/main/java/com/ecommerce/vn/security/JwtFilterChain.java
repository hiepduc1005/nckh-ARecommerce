package com.ecommerce.vn.security;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ecommerce.vn.service.user.UserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilterChain extends OncePerRequestFilter{
	
	@Autowired
	private JwtGenerator jwtGenerator;
	
	@Autowired
	private CustomUserDetailService customUserDetailService;
	
	@Autowired
	public UserService userService;

	@Override
	protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
			throws ServletException, IOException {
		String token = getTokenByRequest(request);
		if(token != null) {
			String email = jwtGenerator.verifyToken(token).getSubject();
			UserDetails user = customUserDetailService.loadUserByUsername(email);
			
			UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = 
					new UsernamePasswordAuthenticationToken(
							email,
							null,
							user.getAuthorities()
						);
			
			SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
		}
		
	 	filterChain.doFilter(request, response);
	}
	
	private String getTokenByRequest(HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if(authHeader != null && !authHeader.trim().isEmpty()) {
			return authHeader.substring(7);
		}
		
		return null;
	}

}
