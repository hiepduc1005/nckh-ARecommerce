package com.ecommerce.vn.service.tag.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.vn.entity.product.Category;
import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.repository.CategoryRepository;
import com.ecommerce.vn.service.product.ProductService;
import com.ecommerce.vn.service.tag.CategoryService;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService{
	
	@Autowired
	private CategoryRepository categoryRepository;
	
	@Autowired
	private ProductService productService;

	@Override
	public Category createCategory(Category category) {
		// TODO Auto-generated method stub
		return categoryRepository.save(category);
	}

	@Override
	public Category updateCategory(Category categoryUpdate) {
		if(categoryUpdate.getId() == null ) {
			throw new RuntimeException("Category id missing");
		}
		return categoryRepository.save(categoryUpdate);
	}

	@Override
	public void deleteCategory(UUID categoryId) {
		Category category = getCategoryById(categoryId);
		categoryRepository.delete(category);
	}

	@Override
	public Category getCategoryById(UUID categoryId) {
		if(categoryId == null ) {
			throw new RuntimeException("Category id missing");
		}
		return categoryRepository.findById(categoryId).orElseThrow(() -> 
				new RuntimeException("Can not found category with id " + categoryId));
	}

	@Override
	public List<Category> searchCategory(String keyword) {
		// TODO Auto-generated method stub
		return categoryRepository.searchCategoryByName(keyword);
	}

	@Override
	public Category getCategoryByname(String categoryName) {
		// TODO Auto-generated method stub
		return categoryRepository.findByName(categoryName).orElseThrow(() ->  
				new RuntimeException("Cant not found category with name: " + categoryName));
	}

	@Override
	public Category activeCategory(UUID categoryId) {
		Category category = getCategoryById(categoryId);
		category.setActive(true);
		return category;
	}

	@Override
	public Category deactiveCategory(UUID categoryId) {
		Category category = getCategoryById(categoryId);
		category.setActive(false);
		return category;
	}

	@Override
	public void addCategoryToProduct(UUID producId, UUID categoryId) {
		Product product = productService.getProductById(producId);
		Category category = getCategoryById(categoryId);
		
		if(!product.getCategories().contains(category)) {
			product.getCategories().add(category);
			productService.updateProduct(product);
			return;
		}
		
		throw new RuntimeException("Category is already in product");
	}

	@Override
	public void removeCategoryFormProduct(UUID producId, UUID categoryId) {
		Product product = productService.getProductById(producId);
		Category category = getCategoryById(categoryId);
		
		if(product.getCategories().contains(category)) {
			product.getCategories().remove(category);
			productService.updateProduct(product);
			return;
		}
		
		throw new RuntimeException("Category not in in product");
		
	}

}
