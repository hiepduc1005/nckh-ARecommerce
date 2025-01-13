package com.ecommerce.vn.dto.category;

import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

public class CategoryUpdateRequest {
	
	private UUID id;
	
	private String categoryName;
	
	private String categoryDescription;
	
	private MultipartFile image;
	
	private Boolean active;
	
	

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public String getCategoryDescription() {
		return categoryDescription;
	}

	public void setCategoryDescription(String categoryDescription) {
		this.categoryDescription = categoryDescription;
	}


	public MultipartFile getImage() {
		return image;
	}

	public void setImage(MultipartFile image) {
		this.image = image;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}
	
	
}
