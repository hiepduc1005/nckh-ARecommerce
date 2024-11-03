package com.ecommerce.service.convert;

import com.ecommerce.dto.variant.VariantCreateRequest;
import com.ecommerce.dto.variant.VariantResponse;
import com.ecommerce.dto.variant.VariantUpdateRequest;
import com.ecommerce.entity.product.Variant;

public class VariantConvert {

    public Variant variantCreateRequestConvert(VariantCreateRequest variantCreateRequest) {
        if (variantCreateRequest == null) {
            return null;
        }

        Variant variant = new Variant();
        variant.setPrice(variantCreateRequest.getPrice());
        variant.setDiscountPrice(variantCreateRequest.getDiscountPrice());
        variant.setQuantity(variantCreateRequest.getQuantity());
        variant.setAttributeValues(variantCreateRequest.getAttributeValue());

        return variant;
    }

    public Variant vairantUpdateConvert(VariantUpdateRequest request, Variant variant) {
        if (request == null || variant == null) {
            return null;
        }

        variant.setPrice(request.getPrice());
        variant.setDiscountPrice(request.getDiscountPrice());
        variant.setQuantity(request.getQuantity());
        variant.setUpdatedBy(request.getUpdatedBy());
        variant.setAttributeValues(request.getAttributeValue());

        return variant;
    }

    public VariantResponse variantConvertToVariantResponse(Variant variant) {
        if (variant == null) {
            return null;
        }

        return new VariantResponse(
                variant.getId(),
                variant.getProduct(),
                variant.getPrice(),
                variant.getDiscountPrice(),
                variant.getQuantity(),
                variant.getCreatedAt(),
                variant.getUpdateAt(),
                variant.getCreatedBy(),
                variant.getUpdatedBy(),
                variant.getAttributeValues()
        );
    }

}
