package com.ecommerce.dto.cart;

import com.ecommerce.entity.cart.CartItem;

import java.util.Set;
import java.util.UUID;

public class CartResponse {

    private UUID cartId;
    private UUID userId;
    private Set<CartItem> items;

    public CartResponse() {
    }

    public CartResponse(UUID cartId, UUID userId, Set<CartItem> items) {
        this.cartId = cartId;
        this.userId = userId;
        this.items = items;
    }

    // Getter và Setter
    public UUID getCartId() {
        return cartId;
    }

    public void setCartId(UUID cartId) {
        this.cartId = cartId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public Set<CartItem> getItems() {
        return items;
    }

    public void setItems(Set<CartItem> items) {
        this.items = items;
    }
}
