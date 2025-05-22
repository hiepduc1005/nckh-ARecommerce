package com.ecommerce.vn.dto.category;


public class CategoryCreateRequest {
	private String name;
	
	private String categoryDescription;
	
	
	

	@Override
	public String toString() {
		return "CategoryCreateRequest [categoryName=" + name + ", categoryDescription=" + categoryDescription
				+ "]";
	}

	public String getCategoryName() {
		return name;
	}

	public void setCategoryName(String categoryName) {
		this.name = categoryName;
	}

	public String getCategoryDescription() {
		return categoryDescription;
	}

	public void setCategoryDescription(String categoryDescription) {
		this.categoryDescription = categoryDescription;
	}

	
	
}
