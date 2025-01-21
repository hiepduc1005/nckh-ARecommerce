package com.ecommerce.vn.dto.cart;

import java.util.UUID;

import com.ecommerce.vn.dto.variant.VariantResponse;

public class CartItemResponse {
	private UUID id;
	private VariantResponse variantResponse;
	private Integer quantity;
	public UUID getId() {
		return id;
	}
	public void setId(UUID id) {
		this.id = id;
	}
	public VariantResponse getVariantResponse() {
		return variantResponse;
	}
	public void setVariantResponse(VariantResponse variantResponse) {
		this.variantResponse = variantResponse;
	}
	public Integer getQuantity() {
		return quantity;
	}
	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}
	
	
}
