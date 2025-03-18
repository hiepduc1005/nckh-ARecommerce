package com.ecommerce.vn.service.cart.impl;

import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.vn.entity.cart.Cart;
import com.ecommerce.vn.entity.cart.CartItem;
import com.ecommerce.vn.entity.coupon.Coupon;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.repository.CartRepository;
import com.ecommerce.vn.service.cart.CartItemService;
import com.ecommerce.vn.service.cart.CartService;

@Service
@Transactional
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemService cartItemService;

    @Override
    public Cart createCart(User user) {
        Cart cart = new Cart();
        cart.setUser(user);
        return cartRepository.save(cart);
    }

    @Override
    public Cart getCartByUserId(UUID userId) {
        return cartRepository.findByUserId(userId);
    }

    @Override
    public Cart addItemToCart(UUID cartId, CartItem cartItem) {
        Cart cart = getCartById(cartId);
        cart.getCartItems().add(cartItem);
        return cartRepository.save(cart);
    }

    @Override
    public Cart removeItemFromCart(UUID cartId, UUID cartItemId) {
        Cart cart = getCartById(cartId);
        cartItemService.deleteCartItem(cartItemId);
        cart.getCartItems().removeIf(item -> item.getId().equals(cartItemId));
        return cartRepository.save(cart);
    }

    @Override
    public Cart clearCart(UUID cartId) {
        Cart cart = getCartById(cartId);
        cart.getCartItems().forEach(cartItem -> cartItemService.deleteCartItem(cartItem.getId()));
        cart.getCartItems().clear();
        return cartRepository.save(cart);
    }

    @Override
    public Set<CartItem> getCartItems(UUID cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));
        return (Set<CartItem>) cart.getCartItems();
    }

    @Override
    public BigDecimal calculateCartTotal(UUID cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));
        return cart.getCartItems().stream()
                .map(cartItem -> cartItem.getVariant().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public boolean isCartEmpty(UUID cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));
        return cart.getCartItems().isEmpty();
    }

    @Override
    public void applyCouponToCart(UUID cartId, Coupon coupon) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));
        if (coupon.getId() == null) {
            throw new RuntimeException("Coupon Id is missing!");
        }
        cart.setCoupon(coupon);
        cartRepository.save(cart);
    }

    @Override
    public int getTotalQuantityInCart(UUID cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));
        return cart.getCartItems().stream().mapToInt(CartItem::getQuantity).sum();
    }

	@Override
	@Transactional
	public Cart getCartById(UUID cartId) {
		if (cartId == null) {
            throw new RuntimeException("Cart Id is missing!");
        }
		return cartRepository.findById(cartId).orElseThrow(() -> 
			new RuntimeException("cart not found with id: " + cartId));
	}

	@Override
	@Transactional
	public Cart getCartByEmail(String email) {
		System.out.println(email);
		return cartRepository.findByUser_Email(email).get();
	}
}
