package com.ecommerce.vn.dto.product;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.ecommerce.vn.dto.category.CategoryResponse;
import com.ecommerce.vn.dto.tag.TagResponse;

public class ProductResponse {
	private UUID id;
	
	private Boolean active;
	
	private String productName;
	
	private String description;
	
	private String shortDescription;
	
	private String imagePath;
	
	private Set<CategoryResponse> categories = new HashSet<CategoryResponse>();
	
	private Set<TagResponse> tags = new HashSet<TagResponse>();
	
	private LocalDateTime createdAt;
	
	private LocalDateTime updatedAt;
	
	private UUID createdBy;
	
	private UUID updatedBy;
	
}
