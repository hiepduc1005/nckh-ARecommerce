package com.ecommerce.vn.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.vn.dto.variant.VariantCreateRequest;
import com.ecommerce.vn.dto.variant.VariantResponse;
import com.ecommerce.vn.entity.product.Variant;
import com.ecommerce.vn.service.convert.VariantConvert;
import com.ecommerce.vn.service.variant.VariantService;

@RestController
@RequestMapping("api/v1/variants")
public class VariantController {

	@Autowired
	public VariantService variantService;
	
	@Autowired
	public VariantConvert variantConvert;
	
	@PostMapping
	public ResponseEntity<VariantResponse> createVariant(@RequestBody VariantCreateRequest variantCreateRequest){
		Variant variant = variantConvert.variantCreateRequestConvertToVariant(variantCreateRequest);
		
		variant = variantService.createVariant(variant);
		
		VariantResponse variantResponse = variantConvert.variantConvertToVariantResponse(variant);
		
		return ResponseEntity.ok(variantResponse);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteVariant(@PathVariable("id") UUID id){
		variantService.deleteVariant(id);
		
		return ResponseEntity.ok("Delete variant success!");
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<VariantResponse> getVariant(@PathVariable("id") UUID id){
		Variant variant = variantService.getVariantById(id);
		VariantResponse variantResponse = variantConvert.variantConvertToVariantResponse(variant);
		
		return ResponseEntity.ok(variantResponse);

	}
	
	@GetMapping("/products/{productId}")
    public ResponseEntity<Page<VariantResponse>> getVariantsByProduct(
            @PathVariable("productId") UUID productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
     
		Pageable pageable = PageRequest.of(page, size);
        Page<Variant> variants = variantService.findAllVariantsByProduct(productId, pageable);
        Page<VariantResponse> variantResponse = variants.map((variant ) -> variantConvert.variantConvertToVariantResponse(variant));
       
        return ResponseEntity.ok(variantResponse);
    }
}
