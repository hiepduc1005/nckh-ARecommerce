package com.ecommerce.vn.dto.category;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;


public class CategoryUpdateRequest {
	
	private UUID id;
	
	private String name;
	
	private String categoryDescription;
	
	@JsonProperty("active")	
	private Boolean active;
	
	
	

	@Override
	public String toString() {
		return "CategoryUpdateRequest [id=" + id + ", categoryName=" + name + ", categoryDescription="
				+ categoryDescription + ", active=" + active + "]";
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
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



	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}
	
	
}
