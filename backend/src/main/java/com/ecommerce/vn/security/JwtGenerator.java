package com.ecommerce.vn.security;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
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
	
    private final Set<String> blackList = new HashSet<>();
	
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
	
	public String generateOTPToken(String email) {
	    Algorithm algorithm = Algorithm.HMAC256(secret);

	    LocalDateTime now = LocalDateTime.now();

	    LocalDateTime expiresAt = now.plusMinutes(15);

	    Date issuedAtDate = Date.from(now.atZone(ZoneId.systemDefault()).toInstant());
	    Date expiresAtDate = Date.from(expiresAt.atZone(ZoneId.systemDefault()).toInstant());

	    return JWT.create()
	        .withIssuer(APP_NAME)
	        .withSubject(email)
	        .withIssuedAt(issuedAtDate)
	        .withExpiresAt(expiresAtDate)
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
		    
		    if (blackList.contains(decodedJWT.getId())) {
                throw new RuntimeException("Token has been revoked");
            }
		    return decodedJWT;
		} catch (Exception e) {
			throw new RuntimeException("Invalid token", e);
		}
	}
	
	public String getUsernameByToken(String token) {
		DecodedJWT decodedJWT = verifyToken(token);
	    String email = decodedJWT.getSubject();
	    return email;
	}
	
	public void revokeToken(String token) {
		Algorithm algorithm = Algorithm.HMAC256(secret);
		
		JWTVerifier verifier = JWT
				.require(algorithm)
				.withIssuer(APP_NAME)
				.build();
		try {
		    DecodedJWT decodedJWT = verifier.verify(token);
		    blackList.add(decodedJWT.getId());
		} catch (Exception e) {
			throw new RuntimeException("Invalid token", e);
		}
	}
}
