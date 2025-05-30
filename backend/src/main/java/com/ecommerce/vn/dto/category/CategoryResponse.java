package com.ecommerce.vn.dto.category;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;


public class CategoryResponse {
	
	private UUID id;
	
	private String name;
	
	private String categoryDescription;
	
	private String imagePath;
	
	private String slug;
	
	@JsonProperty("active")	
	private Boolean active;
	
	private int totalProduct;
	
	private LocalDateTime createdAt;
	
	private LocalDateTime updateAt;
	
	private UUID createdBy;
	
	private UUID updatedBy;
	
	

	public int getTotalProduct() {
		return totalProduct;
	}

	public void setTotalProduct(int totalProduct) {
		this.totalProduct = totalProduct;
	}

	public String getSlug() {
		return slug;
	}

	public void setSlug(String slug) {
		this.slug = slug;
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getCategoryName() {
		return name;
	}

	

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCategoryDescription() {
		return categoryDescription;
	}

	public void setCategoryDescription(String categoryDescription) {
		this.categoryDescription = categoryDescription;
	}

	public String getImagePath() {
		return imagePath;
	}

	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
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

	public CategoryResponse(UUID id, String categoryName, String categoryDescription, String imagePath, Boolean active,
			LocalDateTime createdAt, LocalDateTime updateAt, UUID createdBy, UUID updatedBy) {
		this.id = id;
		this.name = categoryName;
		this.categoryDescription = categoryDescription;
		this.imagePath = imagePath;
		this.active = active;
		this.createdAt = createdAt;
		this.updateAt = updateAt;
		this.createdBy = createdBy;
		this.updatedBy = updatedBy;
	}

	public CategoryResponse(UUID id, String categoryName, String categoryDescription, String imagePath, String slug,
			Boolean active, LocalDateTime createdAt, LocalDateTime updateAt, UUID createdBy, UUID updatedBy) {
		this.id = id;
		this.name = categoryName;
		this.categoryDescription = categoryDescription;
		this.imagePath = imagePath;
		this.slug = slug;
		this.active = active;
		this.createdAt = createdAt;
		this.updateAt = updateAt;
		this.createdBy = createdBy;
		this.updatedBy = updatedBy;
	}
	
	
	
	
}
