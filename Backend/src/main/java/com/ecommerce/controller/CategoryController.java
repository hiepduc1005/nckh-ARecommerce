package com.ecommerce.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.dto.category.CategoryCreateRequest;
import com.ecommerce.dto.category.CategoryResponse;
import com.ecommerce.entity.product.Category;
import com.ecommerce.service.category.CategoryService;
import com.ecommerce.service.convert.CategoryConvert;

@RestController
@RequestMapping("api/v1/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CategoryConvert categoryConvert;

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(@RequestBody CategoryCreateRequest request) {
        Category category = categoryConvert.categoryCreateRequestConvert(request);

        Category saveCate = categoryService.createCategory(category);

        CategoryResponse response = categoryConvert.categoryConvertToCategoryResponse(saveCate);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping
    public ResponseEntity<CategoryResponse> updateCategory(@PathVariable UUID CategoryId, @RequestBody CategoryCreateRequest request) {
        Category categoryToUpdate = categoryService.updateCategory(CategoryId, null)

        Category updateCategory = ca
    }

}
