package com.ecommerce.vn.dto.category;


public class CategoryCreateRequest {
	private String name;
	
	private String categoryDescription;
	
	
	

	@Override
	public String toString() {
		return "CategoryCreateRequest [categoryName=" + name + ", categoryDescription=" + categoryDescription
				+ "]";
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

	
	
}
