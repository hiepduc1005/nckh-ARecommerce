package com.ecommerce.vn.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.entity.user.UserAuthProvider;

public interface UserAuthProviderRepository extends JpaRepository<UserAuthProvider, UUID>{

	boolean existsByUserAndProvider(User user, String provider);

}
