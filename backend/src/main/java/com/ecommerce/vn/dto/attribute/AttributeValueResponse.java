package com.ecommerce.vn.dto.attribute;

import java.util.UUID;

public class AttributeValueResponse {
	private UUID id;
	private UUID attributeId;
	private String attributeName;
	private String attributeValue;

	public String getAttributeValue() {
		return attributeValue;
	}

	public UUID getId() {
		return id;
	}
	

	public UUID getAttributeId() {
		return attributeId;
	}

	public void setAttributeId(UUID attributeId) {
		this.attributeId = attributeId;
	}

	public String getAttributeName() {
		return attributeName;
	}

	public void setAttributeName(String attributeName) {
		this.attributeName = attributeName;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public void setAttributeValue(String attributeValue) {
		this.attributeValue = attributeValue;
	}

	public AttributeValueResponse(String attributeValue, UUID id) {
		this.id = id;
		this.attributeValue = attributeValue;
	}

		
}
