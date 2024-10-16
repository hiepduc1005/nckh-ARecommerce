package com.ecommerce.vn.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.service.user.UserService;

@Service
public class CustomUserDetailService implements UserDetailsService{

	@Autowired
	private UserService userService;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userService.findUserByEmail(username); 
		
		return new org.springframework.security.core.userdetails.User(
				username,
				null,
				user.getRoles()
						.stream()
						.map(role-> new SimpleGrantedAuthority(role.getRoleName()))
						.toList()
				);
	}
	
}
