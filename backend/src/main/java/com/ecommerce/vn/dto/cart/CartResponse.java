package com.ecommerce.vn.dto.cart;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.ecommerce.vn.dto.coupon.CouponResponse;

public class CartResponse {
	private UUID id;
	private UUID userId;
	private List<CartItemResponse> cartItemResponses = new ArrayList<CartItemResponse>();
	private CouponResponse couponResponse;
	public UUID getId() {
		return id;
	}
	public void setId(UUID id) {
		this.id = id;
	}
	public UUID getUserId() {
		return userId;
	}
	public void setUserId(UUID userId) {
		this.userId = userId;
	}
	public List<CartItemResponse> getCartItemResponses() {
		return cartItemResponses;
	}
	public void setCartItemResponses(List<CartItemResponse> cartItemResponses) {
		this.cartItemResponses = cartItemResponses;
	}
	public CouponResponse getCouponResponse() {
		return couponResponse;
	}
	public void setCouponResponse(CouponResponse couponResponse) {
		this.couponResponse = couponResponse;
	}
	
	

}
