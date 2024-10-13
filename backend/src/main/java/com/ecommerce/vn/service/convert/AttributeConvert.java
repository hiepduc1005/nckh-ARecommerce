package com.ecommerce.vn.service.convert;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;

import com.ecommerce.vn.dto.attribute.AttributeCreateRequest;
import com.ecommerce.vn.dto.attribute.AttributeResponse;
import com.ecommerce.vn.dto.attribute.AttributeValueResponse;
import com.ecommerce.vn.entity.attribute.Attribute;

public class AttributeConvert {
    
    @Autowired
    private AttributeValueConvert attributeValueConvert;

    public Attribute attributeCreateRequestConvert(AttributeCreateRequest attributeCreateRequest){
        if (attributeCreateRequest != null) {
            return null;
        }

        Attribute attribute = new Attribute();
        attribute.setAttributeName(attribute.getAttributeName());
        attribute.setAttributeValues(attribute.getAttributeValues());
        attribute.setCreatedAt(attribute.getCreatedAt());
        attribute.setUpdatedAt(attribute.getUpdatedAt());
        attribute.setCreatedBy(attribute.getCreatedBy());
        attribute.setUpdatedBy(attribute.getUpdatedBy());

        return attribute;
    }

    public AttributeResponse attributeConvertToAttributeResponse(Attribute attribute){
        if (attribute == null) {
            return null;
        }

        Set<AttributeValueResponse> attributeValueResponses = attribute.getAttributeValues()
        .stream().map(attributeValueConvert::attributeConvertToAttributeValuesResponse)
        .collect(Collectors.toSet());

        return new AttributeResponse(
            attribute.getId(), 
            attribute.getAttributeName(), 
            attribute.getActive(), 
            attributeValueResponses, 
            attribute.getCreatedAt(), 
            attribute.getUpdatedAt(), 
            attribute.getCreatedBy(), 
            attribute.getUpdatedBy()
            );
    }
}
