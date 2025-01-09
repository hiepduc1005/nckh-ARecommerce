package com.ecommerce.vn.service.variant.Impl;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.product.Variant;
import com.ecommerce.vn.repository.ProductRepository;
import com.ecommerce.vn.repository.VariantRepository;
import com.ecommerce.vn.service.product.ProductService;
import com.ecommerce.vn.service.variant.VariantService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class VariantServiceImpl implements VariantService{

	@Autowired
	private VariantRepository variantRepository;
	
	@Autowired
	private ProductService productService;
	
	@Override
	public Variant createVariant(Variant variant) {

		return variantRepository.save(variant);
	}

	@Override
	public Variant updateVariant(Variant variantUpdate) {
		if(variantUpdate.getId() == null) {
			throw new RuntimeException("Variant id is missing");
		}
		return variantRepository.save(variantUpdate);
	}

	@Override
	public Variant findVariantById(UUID variantId) {
		if(variantId == null) {
			throw new RuntimeException("Variant id is missing");
		}
		return variantRepository.findById(variantId).orElseThrow(() -> 
				new RuntimeException("Variant not found with id: " +variantId ));
	}

	@Override
	public void deleteVariant(UUID variantId) {
		Variant variant = findVariantById(variantId);
		variantRepository.delete(variant);
	}

	@Override
	public List<Variant> findVariantsByProductId(UUID productId) {
		Product product = productService.getProductById(productId);
		
		return null;
	}
}
