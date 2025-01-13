package com.ecommerce.vn.dto.category;

import org.springframework.web.multipart.MultipartFile;

public class CategoryCreateRequest {
	private String categoryName;
	
	private String categoryDescription;
	
	private MultipartFile file;

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

	public MultipartFile getFile() {
		return file;
	}

	public void setFile(MultipartFile file) {
		this.file = file;
	}

	
	
}
