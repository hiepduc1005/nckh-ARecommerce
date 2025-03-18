package com.ecommerce.vn.service.convert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.product.BrandCreateRequest;
import com.ecommerce.vn.dto.product.BrandResponse;
import com.ecommerce.vn.dto.product.BrandUpdateRequest;
import com.ecommerce.vn.entity.product.Brand;
import com.ecommerce.vn.service.product.BrandService;

@Service
public class BrandConvert {
	
	@Autowired
	private BrandService brandService;

	public Brand brandCreateRequestConvertToBrand(BrandCreateRequest brandCreateRequest) {
		if(brandCreateRequest == null) {
			return null;
		}
		
		Brand brand = new Brand();
		brand.setName(brandCreateRequest.getName());
		brand.setDescription(brandCreateRequest.getDescription());
		
		return brand;
	}
	
	public BrandResponse brandConvertToBrandResponse(Brand brand) {
		BrandResponse brandResponse = new BrandResponse();
		brandResponse.setName(brand.getName());
		brandResponse.setDescription(brand.getDescription());
		brandResponse.setImagePath(brand.getImagePath());
		brandResponse.setSlug(brand.getSlug());
		brandResponse.setCreatedAt(brand.getCreatedAt());
		brandResponse.setUpdateAt(brand.getUpdateAt());
		brandResponse.setId(brand.getId());
		
		return brandResponse;
	}
	
	public Brand brandUpdateRequestConvertToBrand(BrandUpdateRequest brandUpdateRequest) {
		if(brandUpdateRequest == null) {
			return null;
		}
		
		Brand brand = brandService.getBrandById(brandUpdateRequest.getId());
		
		brand.setName(brandUpdateRequest.getName());
		brand.setDescription(brandUpdateRequest.getDescription());
		
		
		return brand;
	}
}
