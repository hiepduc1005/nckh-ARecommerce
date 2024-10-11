package com.ecommerce.vn.dto.attribute;

import java.util.HashSet;
import java.util.Set;

public class AttributeCreateRequest {
	private String attributeName;

	private Set<AttributeValueCreateRequest> attributeValueCreateRequest = new HashSet<AttributeValueCreateRequest>();
	
	public Set<AttributeValueCreateRequest> getAttributeValueCreateRequest() {
		return attributeValueCreateRequest;
	}

	public void setAttributeValueCreateRequest(Set<AttributeValueCreateRequest> attributeValueCreateRequest) {
		this.attributeValueCreateRequest = attributeValueCreateRequest;
	}

	public String getAttributeName() {
		return attributeName;
	}

	public void setAttributeName(String attributeName) {
		this.attributeName = attributeName;
	}
	
	
}
