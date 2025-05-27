package com.ecommerce.vn.service.user;

import java.util.List;
import java.util.UUID;

import com.ecommerce.vn.entity.user.User;

public interface UserService {
	
	User findUserByUuId(UUID userId);
	
	User findUserByEmail(String email);
	
	User createUser(User user);
	
	User updateUser(User userUpdate);
	
	void deleteUser(UUID userId);
	
	User registerUser(String email,String password,String firstName, String lastName);
	
	User loginUser(String email,String passowrd);
	
	boolean existByEmail(String email);
	
	User activeUser(User user);
	
	User deactiveUser(User user);
	
	List<User> getUnactiveUser();
	
	List<User> getActiveUser();
	
	User changePassword(String currentPassword,String newPassword,String confirmPassword);

}
