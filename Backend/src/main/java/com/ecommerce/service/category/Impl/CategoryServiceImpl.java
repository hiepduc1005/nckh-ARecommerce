package com.ecommerce.service.category.Impl;

import java.util.List;
import java.util.UUID;

import com.ecommerce.entity.product.Category;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.service.category.CategoryService;

public class CategoryServiceImpl implements CategoryService {

    private CategoryRepository categoryRepository;

    @Override
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(UUID categoryId, Category updatedCategory) {
        try {
            getCategoryById(updatedCategory.getId());

            return categoryRepository.save(updatedCategory);
        } catch (Exception e) {
            throw new ResourceNotFoundException("User", "id", categoryId);
        }
    }

    @Override
    public void deleteCategory(UUID categoryId) {
        try {
            getCategoryById(categoryId);

            categoryRepository.deleteById(categoryId);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Category", "categoryId", categoryId);
        }
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(UUID categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));
    }

    @Override
    public Category createSubCategory(UUID parentId, Category category) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public List<Category> searchCategories(String keyword) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public Category getParentCategory(UUID categoryId) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public boolean isCategoryActive(UUID categoryId) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void activateCategory(UUID categoryId) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void deactivateCategory(UUID categoryId) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

}
