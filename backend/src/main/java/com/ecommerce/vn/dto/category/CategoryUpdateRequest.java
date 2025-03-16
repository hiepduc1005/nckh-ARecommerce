package com.ecommerce.vn.dto.category;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;


public class CategoryUpdateRequest {
	
	private UUID id;
	
	private String categoryName;
	
	private String categoryDescription;
	
	@JsonProperty("active")	
	private Boolean active;
	
	
	

	@Override
	public String toString() {
		return "CategoryUpdateRequest [id=" + id + ", categoryName=" + categoryName + ", categoryDescription="
				+ categoryDescription + ", active=" + active + "]";
	}

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



	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}
	
	
}
