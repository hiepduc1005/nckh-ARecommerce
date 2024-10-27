package com.ecommerce.dto.product;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;


public class ProductCreateRequest {
	
	private String productName;
	
	private String description;
	
	private String shortDescription;
	
	private MultipartFile image;
	
	private Set<UUID> categoryIds = new HashSet<UUID>();
	
	private Set<UUID> tagIds = new HashSet<UUID>();
	
	private Set<UUID> attributeIds = new HashSet<UUID>();

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

	public MultipartFile getImage() {
		return image;
	}

	public void setImage(MultipartFile image) {
		this.image = image;
	}

	public Set<UUID> getCategoryIds() {
		return categoryIds;
	}

	public void setCategoryIds(Set<UUID> categoryIds) {
		this.categoryIds = categoryIds;
	}

	public Set<UUID> getTagIds() {
		return tagIds;
	}

	public void setTagIds(Set<UUID> tagIds) {
		this.tagIds = tagIds;
	}

	public Set<UUID> getAttributeIds() {
		return attributeIds;
	}

	public void setAttributeIds(Set<UUID> attributeIds) {
		this.attributeIds = attributeIds;
	}
	
}
