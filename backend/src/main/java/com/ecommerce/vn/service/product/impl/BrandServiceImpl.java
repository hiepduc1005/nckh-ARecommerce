package com.ecommerce.vn.service.product.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.vn.entity.product.Brand;
import com.ecommerce.vn.repository.BrandRepository;
import com.ecommerce.vn.service.product.BrandService;

@Service
public class BrandServiceImpl implements BrandService{
	
	@Autowired
	private BrandRepository brandRepository;

	@Override
	@Transactional
	public Brand createBrand(Brand brand) {
		String slug = String.join("-", brand.getName().split(" ")); 
		brand.setSlug(slug);
		return brandRepository.save(brand);
	}

	@Override
	@Transactional
	public Brand updateBrand(Brand brand) {
		getBrandById(brand.getId());
		
		return  brandRepository.save(brand);
	}

	@Override
	@Transactional
	public void deleteBrand(UUID brandId) {
		Brand brand = getBrandById(brandId);
		brandRepository.delete(brand);
	}

	@Override
	@Transactional
	public List<Brand> getAllBrands() {
		// TODO Auto-generated method stub
		return brandRepository.findAll();
	}

	@Override
	@Transactional
	public Brand getBrandById(UUID brandId) {
		if(brandId == null) {
			throw new RuntimeException("Product id missing");
		}
		
		return brandRepository.findById(brandId).orElseThrow(() -> 
				new RuntimeException()
				);
	}

	@Override
	@Transactional
	public Brand getBrandByName(String name) {
		// TODO Auto-generated method stub
		return brandRepository.getBrandByName(name).orElseThrow(() -> 
			new RuntimeException("Cant not found brand with name : " + name)
		);
	}

	@Override
	@Transactional
	public Brand getBrandBySlug(String slug) {
		// TODO Auto-generated method stub
		return brandRepository.getBrandBySlug(slug).orElseThrow(() -> 
			new RuntimeException("Cant not found brand with slug : " + slug)
		);
	}

	@Override
	@Transactional
	public Page<Brand> getBrandsWithPaginationAndSorting(int page, int size, String sortBy) {
		Pageable pageable = PageRequest.of(page, size);
		return brandRepository.findAll(pageable);
	}

	
}
