package com.ecommerce.vn.service.cart;

import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;

import com.ecommerce.vn.entity.cart.Cart;
import com.ecommerce.vn.entity.cart.CartItem;
import com.ecommerce.vn.entity.coupon.Coupon;
import com.ecommerce.vn.entity.user.User;

public interface CartService {

    Cart createCart(User user);

    Cart getCartByUserId(UUID userId);

    void addItemToCart(UUID cartId, CartItem cartItem);

    void removeItemFromCart(UUID cartId, UUID cartItemId);

    void clearCart(UUID cartId);
    

    Set<CartItem> getCartItems(UUID cartId);
        
    BigDecimal calculateCartTotal(UUID cartId);
    
    boolean isCartEmpty(UUID cartId);
    
    void applyCouponToCart(UUID cartId,Coupon coupon);
    
    int getTotalQuantityInCart(UUID cartId);
    
    
}

