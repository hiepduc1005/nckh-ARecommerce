package com.ecommerce.controller;

import com.ecommerce.dto.category.CategoryCreateRequest;
import com.ecommerce.dto.category.CategoryResponse;
import com.ecommerce.dto.category.CategoryUpdateRequest;
import com.ecommerce.entity.product.Category;
import com.ecommerce.service.category.CategoryService;
import com.ecommerce.service.convert.CategoryConvert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CategoryConvert categoryConvert;

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(@RequestBody CategoryCreateRequest categoryCreateRequest) {
        Category category = categoryConvert.categoryCreateRequestConvert(categoryCreateRequest);
        Category createdCategory = categoryService.createCategory(category);
        CategoryResponse response = categoryConvert.categoryConvertToCategoryResponse(createdCategory);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(@PathVariable UUID id, @RequestBody CategoryUpdateRequest request) {
        Category existingCategory = categoryService.getCategoryById(id);
        Category updatedCategory = categoryConvert.categoryUpdateConvert(request, existingCategory);
        categoryService.updateCategory(id, updatedCategory);
        CategoryResponse response = categoryConvert.categoryConvertToCategoryResponse(updatedCategory);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable UUID id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        List<CategoryResponse> response = categories.stream()
                .map(categoryConvert::categoryConvertToCategoryResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable UUID id) {
        Category category = categoryService.getCategoryById(id);
        CategoryResponse response = categoryConvert.categoryConvertToCategoryResponse(category);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{parentId}/subcategories")
    public ResponseEntity<CategoryResponse> createSubCategory(@PathVariable UUID parentId, @RequestBody CategoryCreateRequest categoryCreateRequest) {
        Category subCategory = categoryConvert.categoryCreateRequestConvert(categoryCreateRequest);
        Category createdSubCategory = categoryService.createSubCategory(parentId, subCategory);
        CategoryResponse response = categoryConvert.categoryConvertToCategoryResponse(createdSubCategory);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<CategoryResponse>> searchCategories(@RequestParam String keyword) {
        List<Category> categories = categoryService.searchCategories(keyword);
        List<CategoryResponse> response = categories.stream()
                .map(categoryConvert::categoryConvertToCategoryResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/parent")
    public ResponseEntity<CategoryResponse> getParentCategory(@PathVariable UUID id) {
        Category parentCategory = categoryService.getParentCategory(id);
        CategoryResponse response = categoryConvert.categoryConvertToCategoryResponse(parentCategory);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<Void> activateCategory(@PathVariable UUID id) {
        categoryService.activateCategory(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateCategory(@PathVariable UUID id) {
        categoryService.deactivateCategory(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/isActive")
    public ResponseEntity<Boolean> isCategoryActive(@PathVariable UUID id) {
        boolean isActive = categoryService.isCategoryActive(id);
        return ResponseEntity.ok(isActive);
    }
}
