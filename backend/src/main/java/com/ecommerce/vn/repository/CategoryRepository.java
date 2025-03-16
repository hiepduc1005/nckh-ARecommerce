package com.ecommerce.vn.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.entity.product.Category;
import com.ecommerce.vn.entity.product.Product;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID>{

	@Query("SELECT c FROM Category c WHERE LOWER(c.categoryName) LIKE LOWER(CONCAT('%', :name, '%'))")
	List<Category> searchCategoryByName(@Param("name") String name);

	@Query("SELECT c FROM Category c WHERE c.categoryName = :categoryName")
	Optional<Category> findByName(@Param("categoryName") String categoryName);
	
	Page<Category> findAll(Pageable pageable);

}
