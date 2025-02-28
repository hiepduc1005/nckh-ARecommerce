package com.ecommerce.vn.dto.product;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.ecommerce.vn.dto.attribute.AttributeResponse;
import com.ecommerce.vn.dto.category.CategoryResponse;
import com.ecommerce.vn.dto.tag.TagResponse;

public class ProductResponse {
	private UUID id;
	
	private Boolean active;
	
	private String productName;
	
	private String description;
	
	private String shortDescription;
	
	private String imagePath;
	
	private Set<CategoryResponse> categories = new HashSet<CategoryResponse>();
	
	private Set<TagResponse> tags = new HashSet<TagResponse>();
	
	private List<AttributeResponse> attributeResponses = new ArrayList<AttributeResponse>();

	private LocalDateTime createdAt;
	
	private LocalDateTime updatedAt;
	
	private UUID createdBy;
	
	private UUID updatedBy;

	public UUID getId() {
		return id;
	}
	

	public List<AttributeResponse> getAttributeResponses() {
		return attributeResponses;
	}


	public void setAttributeResponses(List<AttributeResponse> attributeResponses) {
		this.attributeResponses = attributeResponses;
	}


	public void setId(UUID id) {
		this.id = id;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getShortDescription() {
		return shortDescription;
	}

	public void setShortDescription(String shortDescription) {
		this.shortDescription = shortDescription;
	}

	public String getImagePath() {
		return imagePath;
	}

	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}

	public Set<CategoryResponse> getCategories() {
		return categories;
	}

	public void setCategories(Set<CategoryResponse> categories) {
		this.categories = categories;
	}

	public Set<TagResponse> getTags() {
		return tags;
	}

	public void setTags(Set<TagResponse> tags) {
		this.tags = tags;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
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
	
	

	public ProductResponse(UUID id, Boolean active, String productName, String description, String shortDescription,
			String imagePath, Set<CategoryResponse> categories, Set<TagResponse> tags,
			List<AttributeResponse> attributeResponses, LocalDateTime createdAt, LocalDateTime updatedAt,
			UUID createdBy, UUID updatedBy) {
		this.id = id;
		this.active = active;
		this.productName = productName;
		this.description = description;
		this.shortDescription = shortDescription;
		this.imagePath = imagePath;
		this.categories = categories;
		this.tags = tags;
		this.attributeResponses = attributeResponses;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.createdBy = createdBy;
		this.updatedBy = updatedBy;
	}


	

	
}
