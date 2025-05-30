package com.ecommerce.vn.dto.order;

import java.util.UUID;

import com.ecommerce.vn.dto.model.ModelDesignResponse;
import com.ecommerce.vn.dto.variant.VariantResponse;

public class OrderItemResponse {
	private UUID id;
	private VariantResponse variantResponse;
	private Integer quantity;
	private ModelDesignResponse modelDesignResponse;
	private Boolean isCustomized;
	
	
	public ModelDesignResponse getModelDesignResponse() {
		return modelDesignResponse;
	}
	public void setModelDesignResponse(ModelDesignResponse modelDesignResponse) {
		this.modelDesignResponse = modelDesignResponse;
	}
	public Boolean getIsCustomized() {
		return isCustomized;
	}
	public void setIsCustomized(Boolean isCustomized) {
		this.isCustomized = isCustomized;
	}
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
