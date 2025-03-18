package com.ecommerce.vn.service.product;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.ecommerce.vn.entity.product.Brand;

public interface BrandService {
    
    Brand createBrand(Brand brand);

    Brand updateBrand( Brand brand);

    void deleteBrand(UUID brandId);
    
    Page<Brand> getBrandsWithPaginationAndSorting(int page, int size, String sortBy);

    List<Brand> getAllBrands();

    Brand getBrandById(UUID brandId);

    Brand getBrandByName(String name);

    Brand getBrandBySlug(String slug);

}
