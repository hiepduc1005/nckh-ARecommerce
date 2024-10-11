package com.ecommerce.vn.service.user.impl;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.exception.ResourceAlreadyExistException;
import com.ecommerce.vn.exception.ResourceNotFoundException;
import com.ecommerce.vn.repository.UserRepository;
import com.ecommerce.vn.service.user.UserService;

@Service
public class UserServiceImpl  implements UserService{
	
	@Autowired
	private UserRepository userRepository;
	

	@Override
	public User findUserByUuId(UUID userId) {
		return userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId)); 
	}

	@Override
	public User findUserByEmail(String email) {
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User", "email", email)); 
	}

	@Override
	public User createUser(User user) {
		if(findUserByUuId(user.getId()) != null) {
			throw new ResourceAlreadyExistException("User","id", user.getId());
		}
		
		return userRepository.save(user);
	}

	@Override
	public User updateUser(User userUpdate) {
		findUserByUuId(userUpdate.getId());
			
		return userRepository.save(userUpdate);
	}

	@Override
	public void deleteUser(UUID userId) {
		findUserByUuId(userId);
			
		userRepository.deleteById(userId);
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
