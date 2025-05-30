package com.ecommerce.vn.service.user.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.vn.entity.cart.Cart;
import com.ecommerce.vn.entity.role.Role;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.repository.UserRepository;
import com.ecommerce.vn.service.role.RoleService;
import com.ecommerce.vn.service.user.UserService;


@Service
@Transactional
public class UserServiceImpl implements UserService{
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private RoleService roleService;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public User findUserByUuId(UUID userId) {
		if(userId == null) {
			throw new RuntimeException("User id missing");
		}
		return userRepository.findById(userId).orElseThrow(() -> 
				new RuntimeException("Can not found user with id:" + userId));
	}

	@Override
	public User findUserByEmail(String email) {
		if(email == null) {
			throw new RuntimeException("Email not found");
		}
		
		return userRepository.findByEmail(email).orElseThrow(() -> 
		new RuntimeException("Can not found user with email:" + email));
	}

	@Override
	public User createUser(User user) {
		
		return userRepository.save(user);
	}

	@Override
	public User updateUser(User userUpdate) {
		if(userUpdate.getId() == null) {
			throw new RuntimeException("User id missing");
		}
		return userRepository.save(userUpdate);
	}

	@Override
	public void deleteUser(UUID userId) {
		User user = findUserByUuId(userId);
		userRepository.delete(user);
	}

	@Override
	public User registerUser(String email, String password, String firstName, String lastName) {
		Boolean isUserRegister = userRepository.findByEmail(email).isPresent();

		if(isUserRegister == false) {
			Role roleUser = roleService.getRoleByName("USER");
			String hashPassword = passwordEncoder.encode(password);
			User user = new User();
			user.setEmail(email);
			user.setLoyaltyPoint(0);
			user.setFirstName(firstName);
			user.setLastName(lastName);
			user.setPassword(hashPassword);
			user.setRoles(List.of(roleUser));
			
			Cart cart = new Cart();
			cart.setUser(user);
			user.setCart(cart);
			
			return createUser(user);
		}
		throw new RuntimeException("Email is registered.");
	}

	@Override
	public User loginUser(String email, String passowrd) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean existByEmail(String email) {
		
		return userRepository.existsByEmail(email);
	}

	@Override
	public User activeUser(User user) {
		if(user == null) {
			throw new RuntimeException("User is null!");
		}
		user.setActive(true);
		return updateUser(user);
	}

	@Override
	public User deactiveUser(User user) {
		if(user == null) {
			throw new RuntimeException("User is null!");
		}
		user.setActive(false);
		return updateUser(user);
	}
	
	@Override
	public List<User> getUnactiveUser() {
		// TODO Auto-generated method stub
		return userRepository.findUnactiveUser();
	}

	@Override
	public List<User> getActiveUser() {
		// TODO Auto-generated method stub
		return userRepository.findActiveUser();
	}

	@Override
	public User changePassword(String currentPassword,String newPassword, String confirmPassword) {
		if(!newPassword.equals(confirmPassword)) {
			throw new RuntimeException("Mật khẩu xác nhận và mật khẩu mới không khớp!");
		}
		
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = findUserByEmail(email);
		
		String hashPassword = user.getPassword();
		
		if(!passwordEncoder.matches(currentPassword, hashPassword)) {
			throw new RuntimeException("Mật khẩu hiện tại không chính xác!");
		}
		String hashNewPassword = passwordEncoder.encode(newPassword);

		user.setPassword(hashNewPassword);
		
		
		return updateUser(user);
	}

	@Override
	@Transactional(readOnly = true)
	public Page<User> getUserPaginate(String keyword, Boolean active, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		
		return userRepository.getUserPaginate(keyword, active, pageable);
	}

	
}
