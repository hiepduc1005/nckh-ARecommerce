package com.ecommerce.vn.service.user.impl;

import java.util.UUID;

import org.apache.catalina.User;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.service.user.UserService;

@Service
public class UserServiceImpl  implements UserService{

	@Override
	public User findUserByUuId(UUID userId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public User findUserByEmail(String email) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public User createUser(User user) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public User updateUser(User userUpdate) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void deleteUser(UUID userId) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public User registerUser(String email, String username, String password) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public User loginUser(String email, String passowrd) {
		// TODO Auto-generated method stub
		return null;
	}

}
