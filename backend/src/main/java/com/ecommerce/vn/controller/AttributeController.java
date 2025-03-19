package com.ecommerce.vn.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.vn.dto.attribute.AtributeUpdateRequest;
import com.ecommerce.vn.dto.attribute.AttributeCreateRequest;
import com.ecommerce.vn.dto.attribute.AttributeResponse;
import com.ecommerce.vn.dto.attribute.AttributeValueResponse;
import com.ecommerce.vn.entity.attribute.Attribute;
import com.ecommerce.vn.entity.attribute.AttributeValue;
import com.ecommerce.vn.service.attribute.AttributeService;
import com.ecommerce.vn.service.convert.AttributeConvert;
import com.ecommerce.vn.service.convert.AttributeValueConvert;

@RestController
@RequestMapping("api/v1/attribute")
public class AttributeController {

	@Autowired
	private AttributeService attributeService;
	
	@Autowired
	private AttributeValueConvert attributeValueConvert;
	
	@Autowired
	private AttributeConvert attributeConvert;
	
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
	
   @PostMapping
    public ResponseEntity<AttributeResponse> createAttribute(@RequestBody AttributeCreateRequest attributeCreateRequest) {
    	Attribute attribute = attributeConvert.attributeCreateRequestConvert(attributeCreateRequest);
    	attribute = attributeService.createAttribute(attribute);
        
        
        AttributeResponse response = attributeConvert.attributeConvertToAttributeResponse(attribute);
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<AttributeResponse> updateAttribute(@RequestBody AtributeUpdateRequest atributeUpdateRequest) {
    	Attribute attribute = attributeConvert.attributeUpdateRequestConvert(atributeUpdateRequest);
    	attribute = attributeService.updateAttribute(attribute);
        AttributeResponse response = attributeConvert.attributeConvertToAttributeResponse(attribute);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{attributeId}")
    public ResponseEntity<String> deleteTag(@PathVariable("attributeId") UUID attributeId) {
        try {
            attributeService.deleteAttribute(attributeId);
            return ResponseEntity.ok("Attribute deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the Tag.");
        }
    }
    
    @GetMapping("/pagination")
    public ResponseEntity<Page<AttributeResponse>> getAttributesWithPaginationAndSorting(
            @RequestParam("page") int page,
            @RequestParam("size") int size,
            @RequestParam(value ="sortBy" , required = false) String sortBy) {
    	
    	Page<Attribute> attributes = attributeService.getAttributesWithPaginationAndSorting(page, size, sortBy);
        
    	Page<AttributeResponse> attributeResponse = attributes.map(attribute -> attributeConvert.attributeConvertToAttributeResponse(attribute));
    	return new ResponseEntity<>(attributeResponse, HttpStatus.OK);
   }
    
    @GetMapping
    public ResponseEntity<List<AttributeResponse>> getAllTags() {
        List<Attribute> attributes = attributeService.getAllAttributes();
        List<AttributeResponse> attributeResponse = attributes.stream()
                .map(attributeConvert::attributeConvertToAttributeResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(attributeResponse);
    }

}
