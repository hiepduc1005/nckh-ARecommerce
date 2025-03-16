package com.ecommerce.vn.dto.category;


public class CategoryCreateRequest {
	private String categoryName;
	
	private String categoryDescription;
	
	
	

	@Override
	public String toString() {
		return "CategoryCreateRequest [categoryName=" + categoryName + ", categoryDescription=" + categoryDescription
				+ "]";
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

	
	
}
