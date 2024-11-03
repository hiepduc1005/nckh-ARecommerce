package com.ecommerce.controller;

import com.ecommerce.dto.cart.CartResponse;
import com.ecommerce.dto.cart.CartUpdateRequest;
import com.ecommerce.service.cart.CartService;
import com.ecommerce.service.convert.CartConvert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.Set;

import com.ecommerce.entity.cart.Cart;
import com.ecommerce.entity.cart.CartItem;

@RestController
@RequestMapping("/api/v1/carts")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private CartConvert cartConvert;

    // @PostMapping
    // public ResponseEntity<CartResponse> createCart(@RequestBody CartCreateRequest request) {
    //     Cart cart = cartConvert.cartCreateRequestToCart(request);
    //     Cart createdCart = cartService.createCart(cart);
    //     CartResponse response = cartConvert.cartToCartResponse(createdCart);
    //     return ResponseEntity.status(HttpStatus.CREATED).body(response);
    // }
    @GetMapping("/user/{userId}/cart")
    public ResponseEntity<CartResponse> getOrCreateCart(@PathVariable UUID userId) {
        Cart cart = cartService.getOrCreateCart(userId);
        CartResponse response = cartConvert.cartToCartResponse(cart);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<CartResponse> getCartByUserId(@PathVariable UUID userId) {
        Cart cart = cartService.getCartByUserId(userId);
        CartResponse response = cartConvert.cartToCartResponse(cart);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{cartId}/items")
    public ResponseEntity<Void> addItemToCart(@PathVariable UUID cartId, @RequestBody CartUpdateRequest request) {
        CartItem cartItem = request.getCartItem();
        cartService.addItemToCart(cartId, cartItem);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{cartId}/items/{cartItemId}")
    public ResponseEntity<Void> removeItemFromCart(@PathVariable UUID cartId, @PathVariable UUID cartItemId) {
        cartService.removeItemFromCart(cartId, cartItemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{cartId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable UUID cartId) {
        cartService.clearCart(cartId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{cartId}/items")
    public ResponseEntity<Set<CartItem>> getCartItems(@PathVariable UUID cartId) {
        Set<CartItem> items = cartService.getCartItems(cartId);
        return ResponseEntity.ok(items);
    }
}
