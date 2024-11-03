package com.ecommerce.dto.cart;

import com.ecommerce.entity.cart.CartItem;

public class CartUpdateRequest {

    private CartItem cartItem;
    private boolean removeItem;

    public CartUpdateRequest() {
    }

    public CartUpdateRequest(CartItem cartItem, boolean removeItem) {
        this.cartItem = cartItem;
        this.removeItem = removeItem;
    }

    // Getter và Setter
    public CartItem getCartItem() {
        return cartItem;
    }

    public void setCartItem(CartItem cartItem) {
        this.cartItem = cartItem;
    }

    public boolean isRemoveItem() {
        return removeItem;
    }

    public void setRemoveItem(boolean removeItem) {
        this.removeItem = removeItem;
    }
}
