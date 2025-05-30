package com.ecommerce.vn.service.convert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.category.CategoryCreateRequest;
import com.ecommerce.vn.dto.category.CategoryResponse;
import com.ecommerce.vn.dto.category.CategoryUpdateRequest;
import com.ecommerce.vn.entity.product.Category;
import com.ecommerce.vn.service.tag.CategoryService;

@Service
public class CategoryConvert {

	@Autowired
	private CategoryService categoryService;
	
    @SuppressWarnings("null")
    public Category categoryCreateRequestConvert(CategoryCreateRequest categoryCreateRequest) {
        if (categoryCreateRequest == null) {
            return null;
        }
        
        String slug = String.join("-", categoryCreateRequest.getName().toLowerCase().split(" ") );
        Category category = new Category();
        category.setCategoryName(categoryCreateRequest.getName());
        category.setCategoryDescription(categoryCreateRequest.getCategoryDescription());
        category.setSlug(slug);

        return category;
    }
    
    public Category categoryUpdateConvertToCategory(CategoryUpdateRequest categoryUpdateRequest) {
    	Category category = categoryService.getCategoryById(categoryUpdateRequest.getId());
        String slug = String.join("-", categoryUpdateRequest.getName().toLowerCase().split(" ") );

        category.setSlug(slug);
    	category.setCategoryName(categoryUpdateRequest.getName());
    	category.setCategoryDescription(categoryUpdateRequest.getCategoryDescription());
    	category.setActive(categoryUpdateRequest.getActive());
    	
    	return category;
    }

    public CategoryResponse categoryConvertToCategoryResponse(Category category) {
        if (category == null) {
            return null;
        }
        
        CategoryResponse categoryResponse = new CategoryResponse(
                category.getId(),
                category.getCategoryName(),
                category.getCategoryDescription(),
                category.getImagePath(),
                category.getSlug(),
                category.getActive(),
                category.getCreatedAt(),
                category.getUpdateAt(),
                category.getCreatedBy(),
                category.getUpdatedBy()
        );
        
        categoryResponse.setTotalProduct(category.getProducts().size());

        return categoryResponse;
    }
}
