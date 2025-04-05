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
import com.ecommerce.vn.service.EmailService;
import com.ecommerce.vn.service.user.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("api/v1/auth")
public class AuthController {


	@Autowired
	private UserService userService;

	@Autowired
	public AuthenticationManager authenticationManager;
	
	@Autowired
	private JwtGenerator jwtGenerator;
	
	@Autowired
	private EmailService emailService;
	
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

			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai tên đăng nhập hoặc mật khẩu!"); // 401 Unauthorized
		}
	}
	
	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@RequestBody UserCreateRequest userCreateRequest){
		try {
			if(userService.existByEmail(userCreateRequest.getEmail())) {
				return ResponseEntity.badRequest().body("Email này đã được đăng ký!");
			}
			userService.registerUser(userCreateRequest.getEmail(),userCreateRequest.getPassword(), userCreateRequest.getFirstname(), userCreateRequest.getLastname());
			String name = userCreateRequest.getFirstname() + userCreateRequest.getLastname();
			if(name == null || name.isEmpty()) {
				emailService.sendWelcomeEmail(userCreateRequest.getEmail(), userCreateRequest.getEmail());
			}else {
				emailService.sendWelcomeEmail(userCreateRequest.getEmail(), name);

			}
			return ResponseEntity.status(HttpStatus.CREATED).body("Đăng ký thành công!");
		}catch (Exception ex) {
			ex.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi! Không thể đăng ký");
	    }
	}
	
	@PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        String token = getTokenByRequest(request);
        if (token == null) {
            return ResponseEntity.badRequest().body("Token is missing");
        }
        jwtGenerator.revokeToken(token);
        return ResponseEntity.ok("Logged out successfully");
    }
	 
	private String getTokenByRequest(HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if(authHeader != null && !authHeader.trim().isEmpty()) {
			return authHeader.substring(7);
		}
		
		return null;
	}
	
	
}
