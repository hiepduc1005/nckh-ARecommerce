package com.ecommerce.vn.security;

import java.io.IOException;
import java.net.http.HttpRequest;
import java.util.Arrays;

import org.apache.tomcat.util.http.parser.HttpHeaderParser.HeaderParsePosition;
import org.apache.tomcat.util.http.parser.HttpHeaderParser.HeaderParseStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter.HeaderValue;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.auth0.jwt.interfaces.Header;
import com.ecommerce.vn.entity.user.User;
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
			User user = userService.findUserByEmail(email);
			
			UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = 
					new UsernamePasswordAuthenticationToken(
							email,
							null,
							customUserDetailService.mapPrivilegesToAuthorities(user.getRoles())
						);
			
			SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
		}
		
	 	filterChain.doFilter(request, response);
	}
	
	private String getTokenByRequest(HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		
		if(!authHeader.trim().isEmpty()) {
			return authHeader.substring(7);
		}
		
		return null;
	}

}
