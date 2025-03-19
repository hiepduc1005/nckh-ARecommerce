package com.ecommerce.vn.dto.attribute;

import java.time.LocalDateTime;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AttributeResponse {
	
	private UUID id;
	
	private String attributeName;
	
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

	public AttributeResponse(UUID id, String attributeName, Boolean active,
			 LocalDateTime createdAt, LocalDateTime updateAt,
			UUID createdBy, UUID updatedBy) {
		this.id = id;
		this.attributeName = attributeName;
		this.active = active;
		this.createdAt = createdAt;
		this.updateAt = updateAt;
		this.createdBy = createdBy;
		this.updatedBy = updatedBy;
	}
	
	
	
}
