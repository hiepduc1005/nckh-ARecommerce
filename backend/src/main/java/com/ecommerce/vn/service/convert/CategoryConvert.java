package com.ecommerce.vn.service.convert;

import com.ecommerce.vn.dto.category.CategoryCreateRequest;
import com.ecommerce.vn.dto.category.CategoryResponse;
import com.ecommerce.vn.entity.product.Category;

public class CategoryConvert {
    
    @SuppressWarnings("null")
    public Category categoryCreateRequestConvert(CategoryCreateRequest categoryCreateRequest){
        if (categoryCreateRequest != null) {
            return null;
        }

        Category category = new Category();
        category.setCategoryName(categoryCreateRequest.getCategoryName());
        category.setCategoryDescription(categoryCreateRequest.getCategoryDescription());
        category.setImagePath(categoryCreateRequest.getImagePath());

        return category;
    }

    public CategoryResponse categoryConvertToCategoryResponse(Category category){
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
