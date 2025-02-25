
package com.ecommerce.vn.dto.attribute;

import java.util.UUID;

public class AttributeValueCreateRequest {
	private UUID attributeId;
	private String attributeValue;
	
	

	public UUID getAttributeId() {
		return attributeId;
	}

	public void setAttributeId(UUID attributeId) {
		this.attributeId = attributeId;
	}

	public String getAttributeValue() {
		return attributeValue;
	}

	public void setAttributeValue(String attributeValue) {
		this.attributeValue = attributeValue;
	}
	
	
}
