package com.ecommerce.vn.service.user.impl;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.entity.cart.Cart;
import com.ecommerce.vn.entity.role.Role;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.exception.ResourceAlreadyExistException;
import com.ecommerce.vn.exception.ResourceNotFoundException;
import com.ecommerce.vn.repository.UserRepository;
import com.ecommerce.vn.service.user.UserService;

import jakarta.transaction.Transactional;

@Service
public class UserServiceImpl implements UserService{
	
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
		
		if (findUserByEmail(user.getEmail()) != null) {
			throw new ResourceAlreadyExistException("User","email", user.getId());
		}

		return userRepository.save(user);
	}

	@Override
	public User updateUser(User userUpdate) {
		try {
			findUserByUuId(userUpdate.getId());
			
			return userRepository.save(userUpdate);
		}catch (Exception e) {
			throw new ResourceNotFoundException("User", "id", userUpdate.getId());
		}
	}

	@Override
	public void deleteUser(UUID userId) {
		try {
			findUserByUuId(userId);
			
			userRepository.deleteById(userId);
		}catch (Exception e) {
			throw new ResourceNotFoundException("User", "id", userId);
		}
		
	}

	@Override
	@Transactional
	public User registerUser(String email, String password) {
		
	if (findUserByEmail(email) != null) {
        throw new ResourceAlreadyExistException("User", "email", email);
	}
   	

    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    String encodedPassword = passwordEncoder.encode(password);
    

    User newUser = new User();
    newUser.setEmail(email);
    newUser.setPassword(encodedPassword);
    newUser.setCart(new Cart());
    
    newUser.setActive(false);

    return createUser(newUser);
	}

	@Override
	public User loginUser(String email, String passowrd) {
		return null;
	}

	@Override
	public boolean existByEmail(String email) {
		return userRepository.existsByEmail(email);
	}

}
