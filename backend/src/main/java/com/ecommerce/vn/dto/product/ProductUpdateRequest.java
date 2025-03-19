package com.ecommerce.vn.dto.product;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


import com.fasterxml.jackson.annotation.JsonProperty;

public class ProductUpdateRequest {
	private UUID id;
	
	private String productName;
	
	private String description;
	
	private String shortDescription;
		
	private List<UUID> categoryIds = new ArrayList<UUID>();
	
	private List<UUID> tagIds = new ArrayList<UUID>();
	
	private List<UUID> attributeIds = new ArrayList<UUID>();
	
	private UUID brandId;
	
	@JsonProperty("active")
	private Boolean active;


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

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}



	public UUID getBrandId() {
		return brandId;
	}

	public void setBrandId(UUID brandId) {
		this.brandId = brandId;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public List<UUID> getCategoryIds() {
		return categoryIds;
	}

	public void setCategoryIds(List<UUID> categoryIds) {
		this.categoryIds = categoryIds;
	}

	public List<UUID> getTagIds() {
		return tagIds;
	}

	public void setTagIds(List<UUID> tagIds) {
		this.tagIds = tagIds;
	}

	public List<UUID> getAttributeIds() {
		return attributeIds;
	}

	public void setAttributeIds(List<UUID> attributeIds) {
		this.attributeIds = attributeIds;
	}

	



}
