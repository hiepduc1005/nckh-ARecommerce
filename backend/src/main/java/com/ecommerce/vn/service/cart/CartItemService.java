package com.ecommerce.vn.service.cart;

import java.util.UUID;

import com.ecommerce.vn.entity.cart.CartItem;

public interface CartItemService {
	
	CartItem createCartItem(CartItem cartItem);
	
	CartItem updateCartItem(CartItem cartItemUpdate);
	
	CartItem getCartItemByIt(UUID cartItem);
	
	boolean deleteCartItem(UUID cartItem);
	
    void updateCartItemQuantity(UUID cartItemId, int quantity);
    
    


}
