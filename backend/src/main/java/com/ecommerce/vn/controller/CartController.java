package com.ecommerce.vn.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.vn.dto.cart.CartItemCreateRequest;
import com.ecommerce.vn.dto.cart.CartItemRemoveRequest;
import com.ecommerce.vn.dto.cart.CartResponse;
import com.ecommerce.vn.entity.cart.Cart;
import com.ecommerce.vn.entity.cart.CartItem;
import com.ecommerce.vn.service.cart.CartService;
import com.ecommerce.vn.service.convert.CartConvert;
import com.ecommerce.vn.service.convert.CartItemConvert;

@RestController
@RequestMapping("api/v1/carts")
public class CartController {

	@Autowired
	private CartService cartService;
	
	@Autowired
	private CartItemConvert cartItemConvert;
	
	@Autowired
	private CartConvert cartConvert;
	
	@PostMapping("/add/{cartId}")
	private ResponseEntity<CartResponse> addItemToCart(@PathVariable("cartId") UUID cartId,@RequestBody CartItemCreateRequest cartItemCreateRequest){
		CartItem cartItem = cartItemConvert.cartItemCreateRequestConvertToCartItem(cartItemCreateRequest);
		Cart cart = cartService.addItemToCart(cartId, cartItem);
		CartResponse cartResponse = cartConvert.cartConvertToCartResponse(cart);
		
		return ResponseEntity.ok(cartResponse);
	}
	
	@PostMapping("/remove/{cartId}")
	private ResponseEntity<CartResponse> removeItemToCart(@PathVariable("cartId") UUID cartId,@RequestBody CartItemRemoveRequest cartItemRemoveRequest){
		Cart cart = cartService.removeItemFromCart(cartId, cartItemRemoveRequest.getId());
		CartResponse cartResponse = cartConvert.cartConvertToCartResponse(cart);
		
		return ResponseEntity.ok(cartResponse);
	}
	
	@DeleteMapping("/clear/cartId")
	public ResponseEntity<String> clearCart(@PathVariable("cartId") UUID cartId){
		cartService.clearCart(cartId);
		return ResponseEntity.ok("Clear cart success!");
	}
	
	
}
