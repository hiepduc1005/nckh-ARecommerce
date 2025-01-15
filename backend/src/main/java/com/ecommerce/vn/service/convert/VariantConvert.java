package com.ecommerce.vn.service.convert;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.attribute.AttributeValueResponse;
import com.ecommerce.vn.dto.variant.VariantResponse;
import com.ecommerce.vn.entity.product.Variant;

@Service
public class VariantConvert {

	@Autowired
	private ProductConvert productConvert;
	
	@Autowired
	private AttributeValueConvert attributeValueConvert;
	
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
		
		return variantResponse;
	}
}
