package com.ecommerce.vn.security;

import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;

@Service
public class JwtGenerator {
	
	private final String APP_NAME = "NCKH";
	
	@Value("${jwt.auth.secret}")
	private String secret; 
	
	@Value("${jwt.auth.expiration}")
	private Long exprirationTime;
	
	public String gennerateToken(String email) {
		Algorithm algorithm = Algorithm.HMAC256(secret);
		
		return JWT.create()
			.withIssuer(APP_NAME)
			.withSubject(email)
			.withIssuedAt(new Date())
			.withExpiresAt(new Date(System.currentTimeMillis() + exprirationTime))
			.withJWTId(UUID.randomUUID().toString())
			.sign(algorithm);		
			
	}
	
	public DecodedJWT verifyToken(String token) {
		Algorithm algorithm = Algorithm.HMAC256(secret);
		
		JWTVerifier verifier = JWT
				.require(algorithm)
				.withIssuer(APP_NAME)
				.build();
		
		try {
		    DecodedJWT decodedJWT = verifier.verify(token);
		    return decodedJWT;
		} catch (Exception e) {
			throw new RuntimeException("Invalid token", e);
		}
	}
}
