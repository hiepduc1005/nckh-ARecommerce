package com.ecommerce.vn.service.attribute.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.vn.entity.attribute.Attribute;
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
		// TODO Auto-generated method stub
		return variantRepository.save(variant);
	}

	@Override
	public Variant getVariantById(UUID id) {
		Optional<Variant> variant = variantRepository.findById(id);
		if(variant.isEmpty()) {
			throw new ResourceNotFoundException("Variant","id", id);
		}
		return variant.get();
	}

	@Override
	public Variant updateVariant(Variant variant) {
		// TODO Auto-generated method stub
		return variantRepository.save(variant);
	}

	@Override
	public void deleteVariant(UUID variantId) {
		if(variantId != null) {
			variantRepository.deleteById(variantId);
			return;
		}
		
		throw new RuntimeException("ID must not null !");
	}

	@Override
	public List<Variant> findAllPriceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	@Transactional(readOnly = true)
	public List<Variant> findAll() {
		// TODO Auto-generated method stub
		return variantRepository.findAll();
	}

	@Override
	@Transactional(readOnly = true)
	public List<Variant> findAllVariantsByProduct(UUID productId) {
		return variantRepository.findByProductId(productId);
	}

	@Override
	public List<Variant> findVariantsByAttributeValues(Set<AttributeValue> attributeValues) {
		// TODO Auto-generated method stub
		return findVariantsByAttributeValues(attributeValues);
	}

	@Override
	public Integer findVariantQuantity(UUID variantId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean isVariantInStock(UUID variantId) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public Variant decreaseStock(UUID variantId, Integer quantity) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public BigDecimal caculateDiscountPrice(UUID variantId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean isVariantOfProduct(UUID variantId, UUID productId) {
		// TODO Auto-generated method stub
		return false;
	}

}
