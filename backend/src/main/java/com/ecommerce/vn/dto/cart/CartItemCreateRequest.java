package com.ecommerce.vn.dto.cart;

import java.util.UUID;

public class CartItemCreateRequest {
	private UUID variantId;
	private Integer quantity;
	public UUID getVariantId() {
		return variantId;
	}
	public void setVariantId(UUID variantId) {
		this.variantId = variantId;
	}
	public Integer getQuantity() {
		return quantity;
	}
	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}
}
