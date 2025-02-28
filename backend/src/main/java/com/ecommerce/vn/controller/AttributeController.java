package com.ecommerce.vn.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.vn.dto.attribute.AttributeValueResponse;
import com.ecommerce.vn.entity.attribute.Attribute;
import com.ecommerce.vn.entity.attribute.AttributeValue;
import com.ecommerce.vn.service.attribute.AttributeService;
import com.ecommerce.vn.service.convert.AttributeValueConvert;

@RestController
@RequestMapping("api/v1/attribute")
public class AttributeController {

	@Autowired
	private AttributeService attributeService;
	
	@Autowired
	private AttributeValueConvert attributeValueConvert;
	
	@GetMapping("{attributeId}/attributeValue")
	private ResponseEntity<List<AttributeValueResponse>> getAtributeValueByAttribute(@PathVariable("attributeId") UUID attributeId){
		Attribute attribute = attributeService.getAttributeById(attributeId);
		for(AttributeValue attributeValue : attribute.getAttributeValues()) {
			System.out.println("value : " + attributeValue.getAttributeValue());
		}
		System.out.println(attribute.getAttributeValues().size());
		System.out.println(attribute.getAttributeName());


		List<AttributeValueResponse> attributeValueResponses = attribute.getAttributeValues().stream().map(attributeValue -> attributeValueConvert.attributeConvertToAttributeValuesResponse(attributeValue)).toList();
		
		return ResponseEntity.ok(attributeValueResponses);
	}
}
