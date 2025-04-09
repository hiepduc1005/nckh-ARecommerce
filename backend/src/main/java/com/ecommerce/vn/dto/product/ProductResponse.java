package com.ecommerce.vn.dto.product;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.ecommerce.vn.dto.attribute.AttributeProductResponse;
import com.ecommerce.vn.dto.category.CategoryResponse;
import com.ecommerce.vn.dto.ratting.RatingResponse;
import com.ecommerce.vn.dto.tag.TagResponse;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ProductResponse {
	private UUID id;
	
	@JsonProperty("active")
	private Boolean active;
	
	private String productName;
	
	private String description;
	
	private String shortDescription;
	
	private String imagePath;
	
	private Integer stock;
	
	private Integer solded;
	
	private BrandResponse brandResponse;
	
	private String slug;
	
	private List<CategoryResponse> categories = new ArrayList<CategoryResponse>();
	
	private List<TagResponse> tags = new ArrayList<TagResponse>();
	
	private List<AttributeProductResponse> attributeResponses = new ArrayList<AttributeProductResponse>();
	
	private LocalDateTime createdAt;
	
	private LocalDateTime updatedAt;
	
	private UUID createdBy;
	
	private UUID updatedBy;
	
	private Double minPrice;
	
	private Double maxPrice;
	
	private Double ratingValue;
	
	private List<RatingResponse> ratingResponses;
	
	private String modelPath;
	
	
	
	public String getModelPath() {
		return modelPath;
	}


	public void setModelPath(String modelPath) {
		this.modelPath = modelPath;
	}


	public String getSlug() {
		return slug;
	}


	public void setSlug(String slug) {
		this.slug = slug;
	}


	public BrandResponse getBrandResponse() {
		return brandResponse;
	}


	public void setBrandResponse(BrandResponse brandResponse) {
		this.brandResponse = brandResponse;
	}


	public Double getRatingValue() {
		return ratingValue;
	}


	public void setRatingValue(Double ratingValue) {
		this.ratingValue = ratingValue;
	}


	public List<RatingResponse> getRatingResponses() {
		return ratingResponses;
	}


	public void setRatingResponses(List<RatingResponse> ratingResponses) {
		this.ratingResponses = ratingResponses;
	}


	
	


	public Integer getSolded() {
		return solded;
	}


	public void setSolded(Integer solded) {
		this.solded = solded;
	}


	public Integer getStock() {
		return stock;
	}


	public void setStock(Integer stock) {
		this.stock = stock;
	}


	public Double getMinPrice() {
		return minPrice;
	}


	public void setMinPrice(Double minPrice) {
		this.minPrice = minPrice;
	}


	public Double getMaxPrice() {
		return maxPrice;
	}


	public void setMaxPrice(Double maxPrice) {
		this.maxPrice = maxPrice;
	}



	public UUID getId() {
		return id;
	}
	

	public List<AttributeProductResponse> getAttributeResponses() {
		return attributeResponses;
	}


	public void setAttributeResponses(List<AttributeProductResponse> attributeResponses) {
		this.attributeResponses = attributeResponses;
	}


	public void setId(UUID id) {
		this.id = id;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getShortDescription() {
		return shortDescription;
	}

	public void setShortDescription(String shortDescription) {
		this.shortDescription = shortDescription;
	}

	public String getImagePath() {
		return imagePath;
	}

	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}

	

	public List<CategoryResponse> getCategories() {
		return categories;
	}


	public void setCategories(List<CategoryResponse> categories) {
		this.categories = categories;
	}


	public List<TagResponse> getTags() {
		return tags;
	}


	public void setTags(List<TagResponse> tags) {
		this.tags = tags;
	}


	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	public UUID getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(UUID createdBy) {
		this.createdBy = createdBy;
	}

	public UUID getUpdatedBy() {
		return updatedBy;
	}

	public void setUpdatedBy(UUID updatedBy) {
		this.updatedBy = updatedBy;
	}
	
	

	public ProductResponse(UUID id, Boolean active, String productName, String description, String shortDescription,
			String imagePath, List<CategoryResponse> categories, List<TagResponse> tags,
			List<AttributeProductResponse> attributeResponses, LocalDateTime createdAt, LocalDateTime updatedAt,
			UUID createdBy, UUID updatedBy, Double ratingValue, List<RatingResponse> ratingResponses) {
		this.id = id;
		this.active = active;
		this.productName = productName;
		this.description = description;
		this.shortDescription = shortDescription;
		this.imagePath = imagePath;
		this.categories = categories;
		this.tags = tags;
		this.attributeResponses = attributeResponses;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.createdBy = createdBy;
		this.updatedBy = updatedBy;
		this.ratingResponses = ratingResponses;
		this.ratingValue = ratingValue;
	}


	

	
}
