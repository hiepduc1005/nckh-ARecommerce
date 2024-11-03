package com.ecommerce.service.cart;

import java.util.Set;
import java.util.UUID;

import com.ecommerce.entity.cart.Cart;
import com.ecommerce.entity.cart.CartItem;

public interface CartService {

    Cart getOrCreateCart(UUID userId);

    Cart getCartByUserId(UUID userId);

    void addItemToCart(UUID cartId, CartItem cartItem);

    void removeItemFromCart(UUID cartId, UUID cartItemId);

    void clearCart(UUID cartId);

    Set<CartItem> getCartItems(UUID cartId);
}
