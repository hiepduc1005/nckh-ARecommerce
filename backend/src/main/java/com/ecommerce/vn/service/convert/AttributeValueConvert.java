package com.ecommerce.vn.service.convert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.attribute.AttributeValueCreateRequest;
import com.ecommerce.vn.dto.attribute.AttributeValueResponse;
import com.ecommerce.vn.entity.attribute.Attribute;
import com.ecommerce.vn.entity.attribute.AttributeValue;
import com.ecommerce.vn.repository.AttributeRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AttributeValueConvert {
	
	@Autowired
	private AttributeRepository attributeRepository;
	

    public AttributeValue attributeValueCreateRequestConvert(AttributeValueCreateRequest attributeValueCreateRequest) {
        if (attributeValueCreateRequest == null) {
            return null;
        }
        
        Attribute attribute = attributeRepository.findById(attributeValueCreateRequest.getAttributeId())
	            .orElseThrow(() -> new EntityNotFoundException("Attribute not found"));

        AttributeValue attributeValue = new AttributeValue();
        attributeValue.setAttribute(attribute);
        attributeValue.setAttributeValue(attributeValueCreateRequest.getAttributeValue());
        return attributeValue;
    }

    public AttributeValueResponse attributeConvertToAttributeValuesResponse(AttributeValue attributeValue) {
        if (attributeValue == null) {
            return null;
        } 
        
        AttributeValueResponse attributeValueResponse = new AttributeValueResponse(attributeValue.getAttributeValue(),attributeValue.getId());
        attributeValueResponse.setAttributeName(attributeValue.getAttribute().getAttributeName());
        attributeValueResponse.setAttributeId(attributeValue.getAttribute().getId());
        return attributeValueResponse;
    }
}
