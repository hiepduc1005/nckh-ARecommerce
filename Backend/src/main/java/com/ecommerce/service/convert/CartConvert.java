package com.ecommerce.service.convert;

import com.ecommerce.dto.cart.CartCreateRequest;
import com.ecommerce.dto.cart.CartResponse;
import com.ecommerce.dto.cart.CartUpdateRequest;
import com.ecommerce.entity.cart.Cart;
import com.ecommerce.entity.cart.CartItem;

import java.util.HashSet;

public class CartConvert {

    // Chuyển đổi từ CartCreateRequest sang Cart
    public Cart cartCreateRequestToCart(CartCreateRequest request) {
        if (request == null) {
            return null;
        }

        Cart cart = new Cart();
        cart.setUserId(request.getUserId());
        cart.setCartItems(new HashSet<>()); // Khởi tạo giỏ hàng rỗng
        return cart;
    }

    // Chuyển đổi từ Cart sang CartResponse
    public CartResponse cartToCartResponse(Cart cart) {
        if (cart == null) {
            return null;
        }

        return new CartResponse(
                cart.getId(),
                cart.getUserId(),
                cart.getCartItems()
        );
    }

    // Cập nhật Cart dựa trên CartUpdateRequest
    public Cart updateCartFromRequest(CartUpdateRequest request, Cart cart) {
        if (request == null || cart == null) {
            return null;
        }

        CartItem cartItem = request.getCartItem();
        if (request.isRemoveItem()) {
            cart.getCartItems().remove(cartItem);
        } else {
            cart.getCartItems().add(cartItem);
        }

        return cart;
    }
}
