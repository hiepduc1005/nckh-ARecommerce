package com.ecommerce.vn.service.convert;

import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.attribute.AttributeValueCreateRequest;
import com.ecommerce.vn.dto.attribute.AttributeValueResponse;
import com.ecommerce.vn.entity.attribute.Attribute;
import com.ecommerce.vn.entity.attribute.AttributeValue;

@Service
public class AttributeValueConvert {

    public AttributeValue attributeValueCreateRequestConvert(AttributeValueCreateRequest attributeValueCreateRequest) {
        if (attributeValueCreateRequest == null) {
            return null;
        }
        
        Attribute attribute = new Attribute();
        attribute.setId(attributeValueCreateRequest.getAttributeId());

        AttributeValue attributeValue = new AttributeValue();
        attributeValue.setAttribute(attribute);
        attributeValue.setAttributeValue(attributeValueCreateRequest.getAttributeValue());
        return attributeValue;
    }

    public AttributeValueResponse attributeConvertToAttributeValuesResponse(AttributeValue attributeValue) {
        if (attributeValue == null) {
            return null;
        }

        return new AttributeValueResponse(attributeValue.getAttributeValue(),attributeValue.getId());
    }
}
