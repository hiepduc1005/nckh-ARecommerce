package com.ecommerce.service.cart;

import java.util.Set;
import java.util.UUID;

import com.ecommerce.entity.cart.Cart;
import com.ecommerce.entity.cart.CartItem;
import com.ecommerce.entity.user.User;

public interface CartService {

    Cart createCart(User user);

    Cart getCartByUserId(UUID userId);

    void addItemToCart(UUID cartId, CartItem cartItem);

    void removeItemFromCart(UUID cartId, UUID cartItemId);

    void clearCart(UUID cartId);

    Set<CartItem> getCartItems(UUID cartId);
}

