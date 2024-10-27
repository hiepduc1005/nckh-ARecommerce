package com.ecommerce.service.cart.impl;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.entity.cart.Cart;
import com.ecommerce.entity.cart.CartItem;
import com.ecommerce.entity.user.User;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.cart.CartService;

@Service
@Transactional
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;  

    @Autowired
    private UserRepository userRepository;  

    @Autowired
    private CartItemRepository cartItemRepository;  

    @Override
    public Cart createCart(User user) {
        Cart cart = new Cart();
        cart.setUser(user);
        return cartRepository.save(cart);
    }

    @Override
    public Cart getCartByUserId(UUID userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            return cartRepository.findByUserId(userId);
        }
        throw new RuntimeException("User not found");
    }

    @Override
    public void addItemToCart(UUID cartId, CartItem cartItem) {
        Optional<Cart> cartOpt = cartRepository.findById(cartId);
        if (cartOpt.isPresent()) {
            Cart cart = cartOpt.get();
            cartItem.setCart(cart);
            cartItemRepository.save(cartItem);
        } else {
            throw new RuntimeException("Cart not found");
        }
    }

    @Override
    public void removeItemFromCart(UUID cartId, UUID cartItemId) {
        Optional<Cart> cartOpt = cartRepository.findById(cartId);
        Optional<CartItem> cartItemOpt = cartItemRepository.findById(cartItemId);

        if (cartOpt.isPresent() && cartItemOpt.isPresent()) {
            cartItemRepository.delete(cartItemOpt.get());
        } else {
            throw new RuntimeException("Cart or CartItem not found");
        }
    }

    @Override
    public void clearCart(UUID cartId) {
        Optional<Cart> cartOpt = cartRepository.findById(cartId);
        if (cartOpt.isPresent()) {
            Cart cart = cartOpt.get();
            cartItemRepository.deleteAll(cart.getCartItems());
        } else {
            throw new RuntimeException("Cart not found");
        }
    }

    @Override
    public Set<CartItem> getCartItems(UUID cartId) {
        Optional<Cart> cartOpt = cartRepository.findById(cartId);
        if (cartOpt.isPresent()) {
            return cartOpt.get().getCartItems();
        }
        throw new RuntimeException("Cart not found");
    }
}

