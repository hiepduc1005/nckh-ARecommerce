package com.ecommerce.vn.service.tag;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.ecommerce.vn.entity.product.Category;

public interface CategoryService {
	
	Category createCategory(Category category);
	
	Page<Category> getCategoriesWithPaginationAndSorting(int page,int size,String sortBy);
	
	Category updateCategory(Category categoryUpdate);
	
	void deleteCategory(UUID categoryId);
	
	Category getCategoryById(UUID categoryId);
	
	List<Category> searchCategory(String keyword);
	
	List<Category> getAllCategories();

	
	Category getCategoryByname(String categoryName);
	
	Category activeCategory(UUID categoryId);
	
	Category deactiveCategory(UUID categoryId);
	
	void addCategoryToProduct(UUID producId, UUID categoryId);
	
	void removeCategoryFormProduct(UUID producId, UUID categoryId);
	
	

}
