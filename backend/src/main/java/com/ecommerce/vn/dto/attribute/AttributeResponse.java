package com.ecommerce.vn.dto.attribute;

import java.time.LocalDateTime;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

public class AttributeResponse {
	
	private UUID id;
	
	private String attributeName;
	
	private Boolean active;

	private Set<AttributeValueResponse> attributeValueResponses = new HashSet<AttributeValueResponse>();
	
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

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public Set<AttributeValueResponse> getAttributeValueResponses() {
		return attributeValueResponses;
	}

	public void setAttributeValueResponses(Set<AttributeValueResponse> attributeValueResponses) {
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
