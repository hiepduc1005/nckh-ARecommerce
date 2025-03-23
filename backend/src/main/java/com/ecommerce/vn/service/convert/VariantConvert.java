package com.ecommerce.vn.service.convert;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.attribute.AttributeValueResponse;
import com.ecommerce.vn.dto.variant.VariantCreateRequest;
import com.ecommerce.vn.dto.variant.VariantResponse;
import com.ecommerce.vn.entity.attribute.AttributeValue;
import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.product.Variant;
import com.ecommerce.vn.repository.ProductRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class VariantConvert {

	@Autowired
	private ProductConvert productConvert;
	
	@Autowired
	private AttributeValueConvert attributeValueConvert;
	
	@Autowired
	private AttributeConvert attributeConvert;
	
	@Autowired
	private ProductRepository productRepository;
	
	public VariantResponse variantConvertToVariantResponse(Variant variant) {
		VariantResponse variantResponse = new VariantResponse();
		variantResponse.setId(variant.getId());
		variantResponse.setDiscountPrice(variant.getDiscountPrice());
		variantResponse.setPrice(variant.getPrice());
		variantResponse.setCreatedAt(variant.getCreatedAt());
		variantResponse.setCreatedBy(variantResponse.getCreatedBy());
		variantResponse.setQuantity(variant.getQuantity());
		variantResponse.setUpdateAt(variant.getUpdateAt());
		variantResponse.setUpdatedBy(variantResponse.getUpdatedBy());
		variantResponse.setProductResponse(productConvert.productConvertToProductResponse(variant.getProduct()));

		List<AttributeValueResponse> attributeValueResponses = variant.getAttributeValues()
				.stream()
				.map((attributeValue) -> attributeValueConvert.attributeConvertToAttributeValuesResponse(attributeValue))
				.toList();
		
		variantResponse.setAttributeValueResponses(attributeValueResponses);
		variantResponse.setImagePath(variant.getImagePath());
		return variantResponse;
	}
	
	public Variant variantCreateRequestConvertToVariant(VariantCreateRequest variantCreateRequest) {
		Product product = productRepository.findById(variantCreateRequest.getProductId())
	            .orElseThrow(() -> new EntityNotFoundException("Product not found"));

	    Variant variant = new Variant();
	    variant.setPrice(BigDecimal.valueOf(variantCreateRequest.getPrice()));
	    variant.setQuantity(variantCreateRequest.getQuantity());
	    variant.setDiscountPrice(BigDecimal.valueOf(variantCreateRequest.getDiscountPrice()));
	    variant.setProduct(product);

	    // Chuyển đổi danh sách AttributeValue
	    List<AttributeValue> attributeValues = variantCreateRequest.getAttributeValueCreateRequests()
	            .stream()
	            .map(attributeValueConvert::attributeValueCreateRequestConvert)
	            .toList();

	    variant.setAttributeValues(attributeValues);

	    return variant;
		
	}
}
