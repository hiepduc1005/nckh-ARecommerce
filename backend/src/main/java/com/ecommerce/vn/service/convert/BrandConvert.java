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
		
        String slug = String.join("-", brandCreateRequest.getName().toLowerCase().split(" ") );

        brand.setSlug(slug);
		brand.setName(brandCreateRequest.getName());
		brand.setDescription(brandCreateRequest.getDescription());
		brand.setCategory(brandCreateRequest.getCategory());
		brand.setOrigin(brandCreateRequest.getOrigin());
		brand.setEstablish(brandCreateRequest.getEstablish());
		
		return brand;
	}
	
	public BrandResponse brandConvertToBrandResponse(Brand brand) {
		if(brand == null) {
			return null;
		}
		BrandResponse brandResponse = new BrandResponse();
		brandResponse.setName(brand.getName());
		brandResponse.setDescription(brand.getDescription());
		brandResponse.setImagePath(brand.getImagePath());
		brandResponse.setSlug(brand.getSlug());
		brandResponse.setCreatedAt(brand.getCreatedAt());
		brandResponse.setUpdateAt(brand.getUpdateAt());
		brandResponse.setId(brand.getId());
		brandResponse.setCategory(brand.getCategory());
		brandResponse.setTotalProducts(brand.getProducts().size());
		brandResponse.setOrigin(brand.getOrigin());
		brandResponse.setEstablish(brand.getEstablish());
		
		return brandResponse;
	}
	
	public Brand brandUpdateRequestConvertToBrand(BrandUpdateRequest brandUpdateRequest) {
		if(brandUpdateRequest == null) {
			return null;
		}
		
		Brand brand = brandService.getBrandById(brandUpdateRequest.getId());
		String slug = String.join("-", brandUpdateRequest.getName().toLowerCase().split(" ") );

        brand.setSlug(slug);
		brand.setName(brandUpdateRequest.getName());
		brand.setDescription(brandUpdateRequest.getDescription());
		brand.setCategory(brandUpdateRequest.getCategory());
		brand.setOrigin(brandUpdateRequest.getOrigin());
		brand.setEstablish(brandUpdateRequest.getEstablish());
		
		return brand;
	}
}
