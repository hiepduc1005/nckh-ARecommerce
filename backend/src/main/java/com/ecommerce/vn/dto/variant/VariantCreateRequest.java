package com.ecommerce.vn.dto.variant;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.ecommerce.vn.dto.attribute.AttributeValueCreateRequest;

public class VariantCreateRequest {

	private UUID productId;
	private Double price;
	private Double discountPrice;
	private Integer quantity;
	private List<AttributeValueCreateRequest> attributeValueCreateRequests = new ArrayList<>();
	public UUID getProductId() {
		return productId;
	}
	public void setProductId(UUID productId) {
		this.productId = productId;
	}
	public Double getPrice() {
		return price;
	}
	public void setPrice(Double price) {
		this.price = price;
	}
	public Double getDiscountPrice() {
		return discountPrice;
	}
	public void setDiscountPrice(Double discountPrice) {
		this.discountPrice = discountPrice;
	}
	public Integer getQuantity() {
		return quantity;
	}
	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}
	public List<AttributeValueCreateRequest> getAttributeValueCreateRequests() {
		return attributeValueCreateRequests;
	}
	public void setAttributeValueCreateRequests(List<AttributeValueCreateRequest> attributeValueCreateRequests) {
		this.attributeValueCreateRequests = attributeValueCreateRequests;
	}
	
	
	
}
