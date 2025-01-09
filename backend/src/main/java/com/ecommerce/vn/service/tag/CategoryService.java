package com.ecommerce.vn.service.tag;

import java.util.List;
import java.util.UUID;

import com.ecommerce.vn.entity.product.Category;

public interface CategoryService {
	
	Category createCategory(Category category);
	
	Category updateCategory(Category categoryUpdate);
	
	void deleteCategory(UUID categoryId);
	
	Category getCategoryById(UUID categoryId);
	
	List<Category> searchCategory(String keyword);
	
	Category getCategoryByname(String categoryName);
	
	Category activeCategory(UUID categoryId);
	
	Category deactiveCategory(UUID categoryId);
	
	void addCategoryToProduct(UUID producId, UUID categoryId);
	
	void removeCategoryFormProduct(UUID producId, UUID categoryId);
	
	

}
