package com.ecommerce.vn.service.variant.Impl;

import java.util.List;
import java.util.UUID;

import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.product.Variant;
import com.ecommerce.vn.repository.ProductRepository;
import com.ecommerce.vn.repository.VariantRepository;
import com.ecommerce.vn.service.variant.VariantService;

import jakarta.transaction.Transactional;

public class VariantServiceImpl implements VariantService{

    private ProductRepository productRepository;
    private VariantRepository variantRepository;

    @Override
    @Transactional
    public Variant createVariant(UUID productId, Variant variant) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        variant.setProduct(product);
        return variantRepository.save(variant);
    }

    @Override
    @Transactional
    public Variant updateVariant(UUID variantId, Variant variantUpdate) {
        Variant existingVariant = variantRepository.findById(variantId)
            .orElseThrow(() -> new RuntimeException("Variant not found with id: " + variantId));

        existingVariant.setPrice(variantUpdate.getPrice());
        existingVariant.setDiscountPrice(variantUpdate.getDiscountPrice());
        existingVariant.setQuantity(variantUpdate.getQuantity());
        existingVariant.setAttributeValues(variantUpdate.getAttributeValues()); 

        return variantRepository.save(existingVariant);
    }

    @Override
    public Variant findVariantById(UUID variantId) {
        return variantRepository.findById(variantId).orElse(null);
    }

    @Override
    public List<Variant> findVariantsByProductId(UUID productId) {
        try {
            productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
    
            return variantRepository.findByProductId(productId);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching variants: " + e.getMessage());
        }
    }
    
}
