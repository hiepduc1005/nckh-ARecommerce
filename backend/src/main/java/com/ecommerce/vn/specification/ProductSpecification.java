package com.ecommerce.vn.specification;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.ecommerce.vn.entity.product.Product;

public class ProductSpecification {

	public static Specification<Product> hasCategoryIn(List<String> categories){
		return (root, query, criteriaBuilder) -> {
			if(categories == null || categories.isEmpty()) return null;
			return root.join("categories").get("categoryName").in(categories);
		};
		
	}
	
	public static Specification<Product> hasBrandIn(List<String> brands) {
        return (root, query, cb) -> {
            if (brands == null || brands.isEmpty()) return null;
            return root.join("brand").get("name").in(brands);
        };
    }
	
	public static Specification<Product> hasPriceGreaterThanOrEqual(BigDecimal minPrice) {
        return (root, query, cb) -> {
            if (minPrice == null) return null;
            return cb.greaterThanOrEqualTo(root.get("variants").get("price"), minPrice);
        };
    }
	
	public static Specification<Product> hasPriceLessThanOrEqual(BigDecimal maxPrice) {
        return (root, query, cb) -> {
            if (maxPrice == null) return null;
            return cb.lessThanOrEqualTo(root.get("variants").get("price"), maxPrice);
        };
    }
	
	public static Specification<Product> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isEmpty()) return null;
            String likePattern = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                cb.like(cb.lower(root.get("productName")), likePattern),
                cb.like(cb.lower(root.get("description")), likePattern)
            );
        };
    }
}
