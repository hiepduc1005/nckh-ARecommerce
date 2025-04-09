package com.ecommerce.vn.dto.variant;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.ecommerce.vn.dto.attribute.AttributeValueResponse;
import com.ecommerce.vn.dto.product.ProductResponse;

public class VariantResponse {
	private UUID id;
	private ProductResponse productResponse;
	private BigDecimal price;
	private BigDecimal discountPrice;
	private Integer quantity;
	private String imagePath;
	private List<AttributeValueResponse> attributeValueResponses;
	private LocalDateTime createdAt;
	private LocalDateTime updateAt;
	private String colorConfig;
	private UUID createdBy;
	private UUID updatedBy;
	
	
	public String getColorConfig() {
		return colorConfig;
	}
	public void setColorConfig(String colorConfig) {
		this.colorConfig = colorConfig;
	}
	public String getImagePath() {
		return imagePath;
	}
	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}

	public UUID getId() {
		return id;
	}
	public void setId(UUID id) {
		this.id = id;
	}
	
	public ProductResponse getProductResponse() {
		return productResponse;
	}
	public void setProductResponse(ProductResponse productResponse) {
		this.productResponse = productResponse;
	}
	public BigDecimal getPrice() {
		return price;
	}
	public void setPrice(BigDecimal price) {
		this.price = price;
	}
	public BigDecimal getDiscountPrice() {
		return discountPrice;
	}
	public void setDiscountPrice(BigDecimal discountPrice) {
		this.discountPrice = discountPrice;
	}
	public Integer getQuantity() {
		return quantity;
	}
	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}
	public List<AttributeValueResponse> getAttributeValueResponses() {
		return attributeValueResponses;
	}
	public void setAttributeValueResponses(List<AttributeValueResponse> attributeValueResponses) {
		this.attributeValueResponses = attributeValueResponses;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public LocalDateTime getUpdateAt() {
		return updateAt;
	}
	public void setUpdateAt(LocalDateTime updateAt) {
		this.updateAt = updateAt;
	}
	public UUID getCreatedBy() {
		return createdBy;
	}
	public void setCreatedBy(UUID createdBy) {
		this.createdBy = createdBy;
	}
	public UUID getUpdatedBy() {
		return updatedBy;
	}
	public void setUpdatedBy(UUID updatedBy) {
		this.updatedBy = updatedBy;
	}

	
}
