package com.ecommerce.vn.service.variant;

import java.util.List;
import java.util.UUID;

import com.ecommerce.vn.entity.product.Variant;

public interface VariantService {
    Variant createVariant(Variant variant); 
    Variant updateVariant( Variant variantUpdate); 
    Variant findVariantById(UUID variantId); 
    void deleteVariant(UUID variantId);
    List<Variant> findVariantsByProductId(UUID productId); 
    
} 
