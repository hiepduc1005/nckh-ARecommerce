package com.ecommerce.vn.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.vn.dto.category.CategoryCreateRequest;
import com.ecommerce.vn.dto.category.CategoryResponse;
import com.ecommerce.vn.dto.category.CategoryUpdateRequest;
import com.ecommerce.vn.entity.product.Category;
import com.ecommerce.vn.service.FileUploadService;
import com.ecommerce.vn.service.convert.CategoryConvert;
import com.ecommerce.vn.service.tag.CategoryService;

@RestController
@RequestMapping("api/v1/categories")
public class CategoryController {
    
	@Autowired
	private CategoryService categoryService;
	
	@Autowired
	private CategoryConvert categoryConvert;
	
	@Autowired
	private FileUploadService fileUploadService;
	
	@PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
	public ResponseEntity<?> createCategory (
			@RequestPart("image") MultipartFile image, 
			@RequestPart("category")  CategoryCreateRequest categoryCreateRequest) {
		
		if(image == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Category image empty!");
		}
				
		String imagePath = fileUploadService.uploadFileToServer(image);
		
		Category category = categoryConvert.categoryCreateRequestConvert(categoryCreateRequest);
 		category.setImagePath(imagePath);
 		category.setActive(false);
		
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
	
	@GetMapping("/pagination")
    public ResponseEntity<Page<CategoryResponse>> getCategoriesWithPaginationAndSorting(
            @RequestParam("page") int page,
            @RequestParam("size") int size,
            @RequestParam(value ="sortBy" , required = false) String sortBy) {
    	
    	Page<Category> categoryPage = categoryService.getCategoriesWithPaginationAndSorting(page, size, sortBy);
        
    	Page<CategoryResponse> productResponses = categoryPage.map(category -> categoryConvert.categoryConvertToCategoryResponse(category));
    	return new ResponseEntity<>(productResponses, HttpStatus.OK);
    }

	
	@GetMapping("/search/{keyword}")
	public ResponseEntity<List<CategoryResponse>> searchCategory(@PathVariable("keyword") String keyword){
		List<Category> categories = categoryService.searchCategory(keyword);
		
		List<CategoryResponse> categoryResponses = categories.stream()
				.map((category) -> categoryConvert.categoryConvertToCategoryResponse(category))
					.toList();
		
		return ResponseEntity.ok(categoryResponses);
	}
	
	
	@PutMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
	public ResponseEntity<?> updateCategory(
			@RequestPart(name = "image", required = false) MultipartFile image, 
			@RequestPart("category")  CategoryUpdateRequest categoryUpdateRequest) {
				
		
		Category category = categoryConvert.categoryUpdateConvertToCategory(categoryUpdateRequest);
		if(image != null) {
			String imagePath = fileUploadService.uploadFileToServer(image);
			category.setImagePath(imagePath);
		}
		
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
