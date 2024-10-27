package com.ecommerce.service.convert;

import com.ecommerce.dto.attribute.AttributeValueCreateRequest;
import com.ecommerce.dto.attribute.AttributeValueResponse;
import com.ecommerce.entity.attribute.Attribute;
import com.ecommerce.entity.attribute.AttributeValue;

public class AttributeValueConvert {

    public Attribute attributeValueCreateRequestConvert(AttributeValueCreateRequest attributeValueCreateRequest) {
        if (attributeValueCreateRequest != null) {
            return null;
        }

        Attribute attribute = new Attribute();
        attribute.setAttributeValues(attribute.getAttributeValues());

        return attribute;
    }

    public AttributeValueResponse attributeConvertToAttributeValuesResponse(AttributeValue attributeValue) {
        if (attributeValue == null) {
            return null;
        }

        return new AttributeValueResponse(attributeValue.getAttributeValue());
    }
}
