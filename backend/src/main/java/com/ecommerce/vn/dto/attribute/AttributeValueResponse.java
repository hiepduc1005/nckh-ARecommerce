package com.ecommerce.vn.dto.attribute;

import java.util.UUID;

public class AttributeValueResponse {
	private UUID id;
	private String attributeValue;

	public String getAttributeValue() {
		return attributeValue;
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public void setAttributeValue(String attributeValue) {
		this.attributeValue = attributeValue;
	}

	public AttributeValueResponse(String attributeValue) {
		this.attributeValue = attributeValue;
	}

		
}
