package com.ecommerce.vn.service.cart.impl;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.entity.cart.CartItem;
import com.ecommerce.vn.repository.CartItemRepository;
import com.ecommerce.vn.service.cart.CartItemService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class CartItemServiceImpl implements CartItemService{
	
	@Autowired
	private CartItemRepository cartItemRepository;

	@Override
	public CartItem createCartItem(CartItem cartItem) {
		return cartItemRepository.save(cartItem);
	}

	@Override
	public CartItem updateCartItem(CartItem cartItemUpdate) {
		if(cartItemUpdate.getId() == null) {
			throw new RuntimeException("CartItem Id missing ");
		}
		
		return cartItemRepository.save(cartItemUpdate);
	}

	@Override
	public CartItem getCartItemByIt(UUID cartItem) {
		if(cartItem == null) {
			throw new RuntimeException("CartItem Id missing ");
		}
		
		return cartItemRepository.findById(cartItem)
        .orElseThrow(() -> new RuntimeException("CartItem not found with id: " + cartItem));
	}

	@Override
	public boolean deleteCartItem(UUID cartItem) {
	    if (cartItem == null) {
	        throw new RuntimeException("CartItem Id missing");
	    }

	    try {
	        cartItemRepository.deleteById(cartItem);
	        return true;
	    } catch (EmptyResultDataAccessException e) {
	        throw new RuntimeException("CartItem not found for deletion with id: " + cartItem);
	    } catch (Exception e) {
	        throw new RuntimeException("An error occurred while deleting CartItem", e);
	    }
	}


	@Override
	public void updateCartItemQuantity(UUID cartItemId, int quantity) {
		if(cartItemId == null) {
			throw new RuntimeException("CartItem Id missing ");
		}
		
		if (quantity < 0) {
		    throw new RuntimeException("Quantity cannot be negative");
		}
		
		CartItem cartItem = cartItemRepository.findById(cartItemId).get();
		
		if(cartItem != null) {
			cartItem.setQuantity(quantity);
			cartItemRepository.save(cartItem);
		}
		
	}

}
