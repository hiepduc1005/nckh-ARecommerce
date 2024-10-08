package com.ecommerce.vn.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.entity.user.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID>{
    boolean exexistsByEmail(String email);
}
