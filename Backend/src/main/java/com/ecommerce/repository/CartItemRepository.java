package com.ecommerce.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.entity.cart.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem,UUID>{

}
