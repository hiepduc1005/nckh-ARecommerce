package com.ecommerce.service.variant;

import java.util.List;
import java.util.UUID;

import com.ecommerce.entity.product.Variant;

public interface VariantService {

    Variant createVariant(UUID productId, Variant variant);

    Variant updateVariant(UUID variantId, Variant variantUpdate);

    Variant findVariantById(UUID variantId);

    List<Variant> findVariantsByProductId(UUID productId);

}
