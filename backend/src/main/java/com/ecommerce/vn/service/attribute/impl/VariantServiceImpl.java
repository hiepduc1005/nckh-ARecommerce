package com.ecommerce.vn.service.attribute.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.vn.entity.attribute.AttributeValue;
import com.ecommerce.vn.entity.product.Variant;
import com.ecommerce.vn.exception.ResourceNotFoundException;
import com.ecommerce.vn.repository.VariantRepository;
import com.ecommerce.vn.service.attribute.VariantService;

@Service
public class VariantServiceImpl implements VariantService{
	
	@Autowired
	private VariantRepository variantRepository;

	@Override
	public Variant createVariant(Variant variant) {
		return variantRepository.save(variant);
	}

	@Override
	public Variant getVariantById(UUID id) {
		Variant variant = variantRepository.findById(id)
				.orElseThrow(() ->  new ResourceNotFoundException("Variant","variantId",id));
				
		return variant;
	}

	@Override
	public Variant updateVariant(Variant variant) {
		getVariantById(variant.getId());
		
		return variantRepository.save(variant);
	}

	@Override
	@Transactional
	public void deleteVariant(UUID variantId) {
		getVariantById(variantId);
		
		variantRepository.deleteById(variantId);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Variant> findAllPriceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
		if(minPrice.compareTo(maxPrice) >= 0) {
			throw new RuntimeException("Min price must less than max price!");
		}
		
		return variantRepository.findAllByDiscountPriceBetween(minPrice, maxPrice);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Variant> findAll() {
		
		return variantRepository.findAll();
	}

	@Override
	@Transactional(readOnly = true)
	public List<Variant> findAllVariantsByProduct(UUID ProductId) {
		if(ProductId != null) {
			List<Variant> variants = variantRepository.findByProductId(ProductId);
			return variants;
		}
		throw new RuntimeException("productId must not null!");
	}

	@Override
	public List<Variant> findVariantsByAttributeValues(Set<AttributeValue> attributeValues) {
		
		return variantRepository.findByAttributeValues(attributeValues, attributeValues.size());
	}

	@Override
	@Transactional
	public Integer findVariantQuantity(UUID variantId) {
		Variant variant = getVariantById(variantId);
		
		return variant.getQuantity();
	}

	@Override
	public boolean isVariantInStock(UUID variantId) {
		Variant variant = getVariantById(variantId);
		return variant.getQuantity() > 0;
	}

	@Override
	@Transactional
	public Variant decreaseStock(UUID variantId, Integer quantity) {
		Integer rowsAffected = variantRepository.decreaseStock(variantId, quantity);
		    
	    if (rowsAffected > 0) {
	        return getVariantById(variantId);
	    } else {
	        throw new IllegalArgumentException("Không thể giảm số lượng. Số lượng hiện tại không đủ hoặc không tìm thấy biến thể.");
	    }
	}

	@Override
	public BigDecimal caculateDiscountPrice(UUID variantId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	@Transactional
	public boolean isVariantOfProduct(UUID variantId, UUID productId) {
		getVariantById(productId);
		return variantRepository.isVariantOfProduct(variantId, productId);
	}

}
