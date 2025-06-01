package com.ecommerce.vn.dto.variant;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.ecommerce.vn.dto.attribute.AttributeValueCreateRequest;

public class VariantUpdateRequest {

	private UUID variantId;
	private Double price;
	private Double discountPrice;
	private Integer quantity;
	private List<AttributeValueCreateRequest> attributeValueCreateRequests = new ArrayList<>();
	private String colorConfig;
	public UUID getVariantId() {
		return variantId;
	}
	public void setVariantId(UUID variantId) {
		this.variantId = variantId;
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
	public String getColorConfig() {
		return colorConfig;
	}
	public void setColorConfig(String colorConfig) {
		this.colorConfig = colorConfig;
	}
	
	
}
