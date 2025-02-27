package com.ecommerce.vn.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.entity.role.Role;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.service.user.UserService;

import jakarta.transaction.Transactional;

@Service
public class CustomUserDetailService implements UserDetailsService{

	@Autowired
	private UserService userService;
	
	@Transactional
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userService.findUserByEmail(username); 
		System.out.println("hello");
		return new org.springframework.security.core.userdetails.User(
				username,
				user.getPassword(),
				mapPrivilegesToAuthorities(user.getRoles())
				);
	}
	
	public Collection<? extends GrantedAuthority> mapPrivilegesToAuthorities(List<Role> roles) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        for (Role role : roles) {
            authorities.add(new SimpleGrantedAuthority(role.getRoleName()));
        }
        return authorities;
	}
	
}
