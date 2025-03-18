package com.ecommerce.vn.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.entity.cart.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, UUID>{
    Cart findByUserId(UUID userId);
    
    Optional<Cart> findByUser_Email(String email);
    
    @Query(value = "SELECT c.* FROM cart c JOIN users u ON u.id = c.user_id WHERE u.email = :email", nativeQuery = true)
    Optional<Cart> getCartByUserEmail(@Param("email") String email);

}
