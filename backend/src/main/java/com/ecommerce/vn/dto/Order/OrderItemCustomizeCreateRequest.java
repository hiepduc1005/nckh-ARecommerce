package com.ecommerce.vn.dto.order;

import java.util.UUID;

public class OrderItemCustomizeCreateRequest {
	private UUID designId;
	private Integer quantity;
	public UUID getDesignId() {
		return designId;
	}
	public void setDesignId(UUID designId) {
		this.designId = designId;
	}
	public Integer getQuantity() {
		return quantity;
	}
	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}
	
	
}
