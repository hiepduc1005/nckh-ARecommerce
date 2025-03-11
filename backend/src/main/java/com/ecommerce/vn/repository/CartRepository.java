package com.ecommerce.vn.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.entity.cart.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, UUID>{
    Cart findByUserId(UUID userId);
    
    @Query("SELECT c FROM Cart c WHERE c.user.email = :email")
    Optional<Cart> findByUserEmail(String email);
}
