package com.ecommerce.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.entity.product.Variant;

@Repository
public interface VariantRepository extends JpaRepository<Variant, UUID>{
    Variant findVariantById(UUID variantId);
    List<Variant> findByProductId(UUID productId);
}
