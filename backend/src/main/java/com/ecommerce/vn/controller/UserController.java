package com.ecommerce.vn.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.vn.dto.user.UserCreateRequest;
import com.ecommerce.vn.dto.user.UserResponse;
import com.ecommerce.vn.dto.user.UserUpdateRequest;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.service.convert.UserConvert;
import com.ecommerce.vn.service.user.UserService;

@RestController
@RequestMapping("api/v1/users")
public class UserController {
	@Autowired
	private UserConvert userConvert;
	
	@Autowired
	private UserService userService;
	
	@PostMapping
	public ResponseEntity<UserResponse> createUser(@RequestBody UserCreateRequest request){
        User user = userConvert.userCreateRequestConvert(request);
        
        User savedUser = userService.createUser(user);

        UserResponse response = userConvert.userConvertToUserResponse(savedUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
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
	public ResponseEntity<UserResponse> updateUser(UserUpdateRequest request){
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
