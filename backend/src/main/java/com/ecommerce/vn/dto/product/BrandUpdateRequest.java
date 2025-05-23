package com.ecommerce.vn.dto.product;

import java.util.UUID;

public class BrandUpdateRequest {

	private UUID id;
	
	private String name;
	
	private String category;
	
	private String description;
	
	private String origin;
	 
	private String establish;
	
	
	

	public String getOrigin() {
		return origin;
	}

	public void setOrigin(String origin) {
		this.origin = origin;
	}

	public String getEstablish() {
		return establish;
	}

	public void setEstablish(String establish) {
		this.establish = establish;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	
}
