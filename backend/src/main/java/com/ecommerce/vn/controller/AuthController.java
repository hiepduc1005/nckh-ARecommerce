package com.ecommerce.vn.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.vn.dto.user.UserAuthenticateSuccess;
import com.ecommerce.vn.dto.user.UserCreateRequest;
import com.ecommerce.vn.dto.user.UserLoginRequest;
import com.ecommerce.vn.security.JwtGenerator;
import com.ecommerce.vn.service.user.UserService;

@RestController
@RequestMapping("api/v1/auth")
public class AuthController {


	@Autowired
	private UserService userService;

	@Autowired
	public AuthenticationManager authenticationManager;
	
	@Autowired
	private JwtGenerator jwtGenerator;
	
	
	@PostMapping("/login")
	public ResponseEntity<?> authenticateUser(@RequestBody UserLoginRequest userLoginRequest){
		try {
			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(userLoginRequest.getEmail(), userLoginRequest.getPassword()));
			
			String token = jwtGenerator.gennerateToken(userLoginRequest.getEmail());
			
			UserAuthenticateSuccess userAuthenticateSuccess = new UserAuthenticateSuccess();
			userAuthenticateSuccess.setToken(token);
			
			return ResponseEntity.ok(userAuthenticateSuccess);
		} catch (AuthenticationException ex) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password"); // 401 Unauthorized
		}
	}
	
	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@RequestBody UserCreateRequest userCreateRequest){
		try {
			if(userService.existByEmail(userCreateRequest.getEmail())) {
				return ResponseEntity.badRequest().body("Email is already in use!");
			}
			userService.registerUser(userCreateRequest.getEmail(),userCreateRequest.getPassword(), userCreateRequest.getFirstname(), userCreateRequest.getLastname());
			
			return ResponseEntity.status(HttpStatus.CREATED).body("User register success");
		}catch (Exception ex) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unable to register user! " + ex.toString() );
	    }
	}
	
	
}
