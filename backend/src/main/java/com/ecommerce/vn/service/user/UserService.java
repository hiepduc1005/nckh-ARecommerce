package com.ecommerce.vn.service.user;

import java.util.UUID;

import org.apache.catalina.User;

public interface UserService {
	
	User findUserByUuId(UUID userId);
	
	User findUserByEmail(String email);
	
	User createUser(User user);
	
	User updateUser(User userUpdate);
	
	void deleteUser(UUID userId);
	

}
