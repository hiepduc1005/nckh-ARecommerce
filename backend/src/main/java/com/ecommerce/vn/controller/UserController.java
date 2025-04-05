package com.ecommerce.vn.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.vn.dto.user.UserCreateRequest;
import com.ecommerce.vn.dto.user.UserForgetPasswordRequest;
import com.ecommerce.vn.dto.user.UserForgotPasswordVerify;
import com.ecommerce.vn.dto.user.UserResponse;
import com.ecommerce.vn.dto.user.UserUpdateRequest;
import com.ecommerce.vn.dto.user.UserVerifyResetPassword;
import com.ecommerce.vn.entity.OTP;
import com.ecommerce.vn.entity.cart.Cart;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.security.JwtGenerator;
import com.ecommerce.vn.service.EmailService;
import com.ecommerce.vn.service.convert.UserConvert;
import com.ecommerce.vn.service.otp.OTPService;
import com.ecommerce.vn.service.user.UserService;

@RestController
@RequestMapping("api/v1/users")
public class UserController {
	@Autowired
	private UserConvert userConvert;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private OTPService otpService;
	
	@Autowired
	private JwtGenerator jwtGenerator;
	
	@Autowired
	private EmailService emailService;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@PostMapping
	public ResponseEntity<UserResponse> createUser(@RequestBody UserCreateRequest request){
        User user = userConvert.userCreateRequestConvert(request);
        
        User savedUser = userService.createUser(user);

        UserResponse response = userConvert.userConvertToUserResponse(savedUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
	
	@PostMapping("/forgot-password/request")
	public ResponseEntity<?> requestForgotPassword(@RequestBody UserForgetPasswordRequest request) throws IOException{
       
		OTP otp = otpService.generateOTPWithEmail(request.getEmail());
		
		if (otp != null) {
			emailService.sendOtpEmail(otp.getEmail(), otp.getEmail(), otp.getCode());
            return ResponseEntity
                .status(HttpStatus.OK)
                .body( "Mã OTP đã được gửi đến email của bạn");
        } else {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body( "Không thể gửi mã OTP");
        }

    }
	
	@PostMapping("/reset-password/verify")
	public ResponseEntity<?> verifyResetToken(@RequestBody UserVerifyResetPassword request) throws IOException{
       
		String token = request.getToken();
		String newPassword = request.getNewPassword();
		
		String email = jwtGenerator.verifyToken(token).getSubject();
		User user = userService.findUserByEmail(email);
		
		String hashPassword = passwordEncoder.encode(newPassword);
		user.setPassword(hashPassword);
		
		userService.updateUser(user);
		
		return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công"));

    }
	
	@PostMapping("/forgot-password/verify")
	public ResponseEntity<?> requestVerifyForgotPassword(@RequestBody UserForgotPasswordVerify forgotPasswordVerify){
		String otpCode = forgotPasswordVerify.getOtp();
		String email = forgotPasswordVerify.getEmail();
       
		boolean isVerify = otpService.verifyOTP(email, otpCode);
		
		if (isVerify) {
			String tokenOTP = jwtGenerator.generateOTPToken(email);
            return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body( Map.of("token",tokenOTP));
        } else {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Mã OTP không hợp lệ"));
        }

    }

	@GetMapping("/{userId}")
	public ResponseEntity<UserResponse> findUserById(@PathVariable("userId") UUID userId) {
		User user = userService.findUserByUuId(userId);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); 
		}
		UserResponse response = userConvert.userConvertToUserResponse(user); 
		return ResponseEntity.ok(response); 
	}
	
	
	
	@GetMapping("/authenticated")
	public ResponseEntity<UserResponse> getUserAuthenticated() {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = userService.findUserByEmail(email);
		if(user.getCart() == null) {
    		Cart cart = new Cart();
			cart.setUser(user);
			user.setCart(cart);
			
			userService.updateUser(user);
    	}
		UserResponse response = userConvert.userConvertToUserResponse(user); 
		return ResponseEntity.ok(response); 
	}
	
	@GetMapping("/active")
	public ResponseEntity<List<UserResponse>> getActiveUser() {
		List<User> users = userService.getActiveUser();
		if (users.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); 
		}
		
		List<UserResponse> userResponses = users.stream().map((user) -> userConvert.userConvertToUserResponse(user)).toList();
		return ResponseEntity.ok(userResponses); 
	}
	
	@GetMapping("/unactive")
	public ResponseEntity<List<UserResponse>> getUnactiveUser() {
		List<User> users = userService.getUnactiveUser();
		if (users.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); 
		}
		
		List<UserResponse> userResponses = users.stream().map((user) -> userConvert.userConvertToUserResponse(user)).toList();
		return ResponseEntity.ok(userResponses); 
	}

	@GetMapping("{userEmail}")
	public ResponseEntity<UserResponse> findUserByEmail(@PathVariable("userEmail") String email){
		User user = userService.findUserByEmail(email);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); 
		}

		UserResponse response = userConvert.userConvertToUserResponse(user);
		return ResponseEntity.ok(response);
	}

	@PutMapping
	public ResponseEntity<UserResponse> updateUser(@RequestBody UserUpdateRequest request){
		System.out.println(request.toString());
		User userToUpdate = userConvert.userUpdateRequestConvert(request); 
		User updatedUser = userService.updateUser(userToUpdate);
		UserResponse response = userConvert.userConvertToUserResponse(updatedUser); 
		
		return ResponseEntity.ok(response); 
	}
	

	@DeleteMapping("/{userId}")
	public ResponseEntity<String> deleteUser(@PathVariable("userId") UUID userId){
		try {
            userService.deleteUser(userId);
            return ResponseEntity.ok("User deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the user.");
        }
	}
	
	

}
