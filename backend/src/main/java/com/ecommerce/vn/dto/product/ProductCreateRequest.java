package com.ecommerce.vn.dto.product;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.vn.dto.attribute.AttributeCreateRequest;


public class ProductCreateRequest {
	
	private String productName;
	
	private String description;
	
	private String shortDescription;
	
	
//	private Set<UUID> categoryIds = new HashSet<UUID>();
//	
//	private Set<UUID> tagIds = new HashSet<UUID>();
	
	private List<AttributeCreateRequest> attributeCreateRequests;

	
	@Override
	public String toString() {
		return "ProductCreateRequest [productName=" + productName + ", description=" + description
				+ ", shortDescription=" + shortDescription + ", attributeCreateRequests=" + attributeCreateRequests
				+ "]";
	}

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

	
	public List<AttributeCreateRequest> getAttributeCreateRequests() {
		return attributeCreateRequests;
	}

	public void setAttributeCreateRequests(List<AttributeCreateRequest> attributeCreateRequests) {
		this.attributeCreateRequests = attributeCreateRequests;
	}
	
	

//	public Set<UUID> getCategoryIds() {
//		return categoryIds;
//	}
//
//	public void setCategoryIds(Set<UUID> categoryIds) {
//		this.categoryIds = categoryIds;
//	}
//
//	public Set<UUID> getTagIds() {
//		return tagIds;
//	}
//
//	public void setTagIds(Set<UUID> tagIds) {
//		this.tagIds = tagIds;
//	}

	
}
