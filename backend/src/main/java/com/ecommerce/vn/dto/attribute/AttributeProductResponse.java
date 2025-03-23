package com.ecommerce.vn.dto.attribute;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AttributeProductResponse {
	private UUID id;
	
	private String attributeName;
	
	private List<AttributeValueResponse> attributeValueResponses;
	
	@JsonProperty("active")
	private Boolean active;
	
	private LocalDateTime createdAt;
	
	private LocalDateTime updateAt;
	
	private UUID createdBy;
	
	private UUID updatedBy;

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getAttributeName() {
		return attributeName;
	}

	public void setAttributeName(String attributeName) {
		this.attributeName = attributeName;
	}

	public List<AttributeValueResponse> getAttributeValueResponses() {
		return attributeValueResponses;
	}

	public void setAttributeValueResponses(List<AttributeValueResponse> attributeValueResponses) {
		this.attributeValueResponses = attributeValueResponses;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
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
