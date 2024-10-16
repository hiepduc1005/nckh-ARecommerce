package com.ecommerce.vn.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.vn.dto.user.UserLoginRequest;
import com.ecommerce.vn.dto.user.UserResponse;
import com.ecommerce.vn.security.JwtGenerator;
import com.ecommerce.vn.service.user.UserService;

@RestController
@RequestMapping("api/v1")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@Autowired
	public AuthenticationManager authenticationManager;
	
	@Autowired
	private JwtGenerator jwtGenerator;
	
	public ResponseEntity<UserResponse> authenticateUser(@RequestBody UserLoginRequest userLoginRequest){
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(userLoginRequest.getEmail(), userLoginRequest.getPassword()));
	
	}
}
