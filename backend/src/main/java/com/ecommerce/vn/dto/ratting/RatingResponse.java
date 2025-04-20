package com.ecommerce.vn.dto.ratting;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.ecommerce.vn.dto.user.UserResponse;

public class RatingResponse {

	private UUID id;
	private UUID productId;
	private UserResponse userResponse;
	private Double ratingValue;
    private String comment;
    private Boolean isVerified;
    private List<String> imagePaths;
	private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    
	public List<String> getImagePaths() {
		return imagePaths;
	}
	public void setImagePaths(List<String> imagePaths) {
		this.imagePaths = imagePaths;
	}
	public UUID getId() {
		return id;
	}
	public void setId(UUID id) {
		this.id = id;
	}
	public UUID getProductId() {
		return productId;
	}
	public void setProductId(UUID productId) {
		this.productId = productId;
	}
	public UserResponse getUserResponse() {
		return userResponse;
	}
	public void setUserResponse(UserResponse userResponse) {
		this.userResponse = userResponse;
	}
	public Double getRatingValue() {
		return ratingValue;
	}
	public void setRatingValue(Double ratingValue) {
		this.ratingValue = ratingValue;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public Boolean getIsVerified() {
		return isVerified;
	}
	public void setIsVerified(Boolean isVerified) {
		this.isVerified = isVerified;
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

    
    
}
