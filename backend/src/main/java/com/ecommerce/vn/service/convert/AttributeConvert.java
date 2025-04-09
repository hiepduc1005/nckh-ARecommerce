package com.ecommerce.vn.service.convert;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.attribute.AtributeUpdateRequest;
import com.ecommerce.vn.dto.attribute.AttributeCreateRequest;
import com.ecommerce.vn.dto.attribute.AttributeProductResponse;
import com.ecommerce.vn.dto.attribute.AttributeResponse;
import com.ecommerce.vn.dto.attribute.AttributeValueResponse;
import com.ecommerce.vn.entity.attribute.Attribute;
import com.ecommerce.vn.service.attribute.AttributeService;

@Service
public class AttributeConvert {
    
	@Autowired
	private AttributeService attributeService;
	
	@Autowired
	private AttributeValueConvert attributeValueConvert;

    public Attribute attributeCreateRequestConvert(AttributeCreateRequest attributeCreateRequest){
        if (attributeCreateRequest == null) {
            return null;
        }

        Attribute attribute = new Attribute();
        attribute.setAttributeName(attributeCreateRequest.getName());
        attribute.setActive(attributeCreateRequest.getActive());
       

        return attribute;
    }
    

    public Attribute attributeUpdateRequestConvert(AtributeUpdateRequest atributeUpdateRequest){
        if (atributeUpdateRequest == null) {
            return null;
        }

        
        Attribute attribute = attributeService.getAttributeById(atributeUpdateRequest.getId());
        attribute.setAttributeName(atributeUpdateRequest.getName());
        attribute.setActive(atributeUpdateRequest.getActive());
       

        return attribute;
    }

    public AttributeResponse attributeConvertToAttributeResponse(Attribute attribute){
        if (attribute == null) {
            return null;
        }

        return new AttributeResponse(
            attribute.getId(), 
            attribute.getAttributeName(), 
            attribute.getActive(), 
            attribute.getCreatedAt(), 
            attribute.getUpdatedAt(), 
            attribute.getCreatedBy(), 
            attribute.getUpdatedBy()
            );
    }
    
    public AttributeProductResponse attributeProductConvertToAttributeProductResponse(Attribute attribute){
        if (attribute == null) {
            return null;
        }
        
        AttributeProductResponse attributeProductResponse = new AttributeProductResponse();
        attributeProductResponse.setId(attribute.getId());
        attributeProductResponse.setActive(attribute.getActive());
        attributeProductResponse.setAttributeName(attribute.getAttributeName());
        attributeProductResponse.setCreatedAt(attribute.getCreatedAt());
        attributeProductResponse.setUpdateAt(attribute.getUpdatedAt());
        attributeProductResponse.setCreatedBy(attribute.getCreatedBy());
        attributeProductResponse.setUpdatedBy(attribute.getUpdatedBy());
        
        List<AttributeValueResponse> attributeValueResponses = attribute.getAttributeValues()
        		.stream()
        		.map(attributeValue -> attributeValueConvert.attributeConvertToAttributeValuesResponse(attributeValue)).toList();
        attributeProductResponse.setAttributeValueResponses(attributeValueResponses);

        return attributeProductResponse;
    }
}
