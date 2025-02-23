package com.ecommerce.vn.service.convert;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.cart.CartItemResponse;
import com.ecommerce.vn.dto.cart.CartResponse;
import com.ecommerce.vn.entity.cart.Cart;


@Service
public class CartConvert {
	
	@Autowired
	private CouponConvert couponConvert;
	
	@Autowired
	private CartItemConvert cartItemConvert;

	public CartResponse cartConvertToCartResponse(Cart cart) {
		CartResponse cartResponse = new CartResponse();
		cartResponse.setId(cart.getId());
		cartResponse.setUserId(cart.getUser().getId());
		cartResponse.setCouponResponse(couponConvert.couponConvertToCouponResponse(cart.getCoupon()));
		
		List<CartItemResponse> cartItemResponses = cart.getCartItems().stream()
				.map(
						(cartItem) -> cartItemConvert.cartItemConvertToCartItemResponse(cartItem))
				.toList(); 
		cartResponse.setCartItemResponses(cartItemResponses);
		
		return cartResponse;
	}
}
