package com.ecommerce.service.category;

import java.util.List;
import java.util.UUID;

import com.ecommerce.entity.product.Category;

public interface CategoryService {

    Category createCategory(Category category);

    Category updateCategory(UUID categoryId, Category updatedCategory);

    void deleteCategory(UUID categoryId);

    List<Category> getAllCategories();

    Category getCategoryById(UUID categoryId);

    // Tạo danh mục con cho danh mục cha
    Category createSubCategory(UUID parentId, Category category);

    List<Category> searchCategories(String keyword);

    // Lấy danh mục cha của một danh mục
    Category getParentCategory(UUID categoryId);

    boolean isCategoryActive(UUID categoryId);

    void activateCategory(UUID categoryId);

    void deactivateCategory(UUID categoryId);
}
