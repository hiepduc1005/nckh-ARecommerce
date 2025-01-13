package com.ecommerce.vn.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.vn.dto.category.CategoryCreateRequest;
import com.ecommerce.vn.dto.category.CategoryResponse;
import com.ecommerce.vn.dto.category.CategoryUpdateRequest;
import com.ecommerce.vn.entity.product.Category;
import com.ecommerce.vn.service.FileUploadService;
import com.ecommerce.vn.service.convert.CategoryConvert;
import com.ecommerce.vn.service.tag.CategoryService;

@Service
@RestController("api/v1/categories")
public class CategoryController {
    
	@Autowired
	private CategoryService categoryService;
	
	@Autowired
	private CategoryConvert categoryConvert;
	
	@Autowired
	private FileUploadService fileUploadService;
	
	@PostMapping
	public ResponseEntity<?> createCategory(@ModelAttribute CategoryCreateRequest categoryCreateRequest) {
		
		if(categoryCreateRequest.getFile() == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Category empty!");
		}
		
		String imagePath = fileUploadService.uploadFileToServer(categoryCreateRequest.getFile());
		
		Category category = categoryConvert.categoryCreateRequestConvert(categoryCreateRequest);
		category.setImagePath(imagePath);
		
		CategoryResponse categoryResponse = categoryConvert.categoryConvertToCategoryResponse(categoryService.createCategory(category));
		return ResponseEntity.status(200).body(categoryResponse);
	}
	
	@GetMapping("/{categoryId}")
	public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable("categoryId") UUID categoryId){
		Category category  = categoryService.getCategoryById(categoryId);
		
		CategoryResponse categoryResponse = categoryConvert.categoryConvertToCategoryResponse(category);
		
		return ResponseEntity.ok(categoryResponse);
	}
	
	@PostMapping("/active/{categoryId}")
	public ResponseEntity<CategoryResponse> activeCategory(@PathVariable("categoryId") UUID categoryId){
		Category category  = categoryService.activeCategory(categoryId);
		
		CategoryResponse categoryResponse = categoryConvert.categoryConvertToCategoryResponse(category);
		
		return ResponseEntity.ok(categoryResponse);
	}
	
	@PostMapping("/deactive/{categoryId}")
	public ResponseEntity<CategoryResponse> deactiveCategory(@PathVariable("categoryId") UUID categoryId){
		Category category  = categoryService.deactiveCategory(categoryId);
		
		CategoryResponse categoryResponse = categoryConvert.categoryConvertToCategoryResponse(category);
		
		return ResponseEntity.ok(categoryResponse);
	}
	
	@GetMapping
	public ResponseEntity<List<CategoryResponse>> getAllCategory(){
		List<Category> categories = categoryService.getAllCategories();
		
		List<CategoryResponse> categoryResponses = categories.stream()
				.map((category) -> categoryConvert.categoryConvertToCategoryResponse(category))
					.toList();
		
		return ResponseEntity.ok(categoryResponses);
	}
	
	@GetMapping("/search/{keyword}")
	public ResponseEntity<List<CategoryResponse>> searchCategory(@PathVariable("keyword") String keyword){
		List<Category> categories = categoryService.searchCategory(keyword);
		
		List<CategoryResponse> categoryResponses = categories.stream()
				.map((category) -> categoryConvert.categoryConvertToCategoryResponse(category))
					.toList();
		
		return ResponseEntity.ok(categoryResponses);
	}
	
	
	@PutMapping
	public ResponseEntity<?> updateCategory(@RequestBody CategoryUpdateRequest categoryUpdateRequest) {
		
		if(categoryUpdateRequest.getImage() == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Category empty!");
		}
		
		String imagePath = fileUploadService.uploadFileToServer(categoryUpdateRequest.getImage());
		
		Category category = categoryConvert.categoryUpdateConvertToCategory(categoryUpdateRequest);
		category.setImagePath(imagePath);
		
		CategoryResponse categoryResponse = categoryConvert.categoryConvertToCategoryResponse(categoryService.updateCategory(category));
		return ResponseEntity.status(200).body(categoryResponse);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteCategory(@PathVariable(name = "id") UUID id){
		Category category = categoryService.getCategoryById(id);
		categoryService.deleteCategory(id);
		
		return ResponseEntity.ok("Delete category success!");
	}

}
