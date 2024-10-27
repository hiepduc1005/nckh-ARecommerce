package com.ecommerce.service.convert;

import com.ecommerce.dto.category.CategoryCreateRequest;
import com.ecommerce.dto.category.CategoryResponse;
import com.ecommerce.dto.category.CategoryUpdateRequest;
import com.ecommerce.entity.product.Category;

public class CategoryConvert {

    @SuppressWarnings("null")
    public Category categoryCreateRequestConvert(CategoryCreateRequest categoryCreateRequest) {
        if (categoryCreateRequest != null) {
            return null;
        }

        Category category = new Category();
        category.setCategoryName(categoryCreateRequest.getCategoryName());
        category.setCategoryDescription(categoryCreateRequest.getCategoryDescription());
        category.setImagePath(categoryCreateRequest.getImagePath());

        return category;
    }

    public Category categoryUpdateConvert(CategoryUpdateRequest request, Category category) {
        if (request == null || category == null) {
            return null;
        }

        category.setCategoryName(request.getCategoryName());
        category.setCategoryDescription(request.getCategoryDescription());
        category.setImagePath(request.getImagePath());
        category.setActive(request.getActive());

        return category;
    }

    public CategoryResponse categoryConvertToCategoryResponse(Category category) {
        if (category == null) {
            return null;
        }

        return new CategoryResponse(
                category.getId(),
                category.getCategoryName(),
                category.getCategoryDescription(),
                category.getImagePath(),
                category.getActive(),
                category.getCreatedAt(),
                category.getUpdateAt(),
                category.getCreatedBy(),
                category.getUpdatedBy()
        );
    }
}
