package com.ecommerce.vn.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.entity.user.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID>{
    Optional<User> findByEmail(String email);
    Optional<User> findByUserName(String userName);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.active = false")
    List<User> findUnactiveUser();
    
    @Query("SELECT u FROM User u WHERE u.active = true")
    List<User> findActiveUser();
} 

