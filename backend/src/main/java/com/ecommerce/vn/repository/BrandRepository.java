package com.ecommerce.vn.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.entity.product.Brand;

@Repository
public interface BrandRepository extends JpaRepository<Brand, UUID>{
	
	@Query("SELECT b FROM Brand b WHERE b.name = :brandName")
	Optional<Brand> getBrandByName( @Param("brandName") String brandName);
	
	@Query("SELECT b FROM Brand b WHERE b.slug = :slug")
	Optional<Brand> getBrandBySlug( @Param("slug") String slug);
	
	@Query("SELECT b FROM Brand b ORDER BY b.name ASC")
    List<Brand> getAllBrandsSortedByName();

}
