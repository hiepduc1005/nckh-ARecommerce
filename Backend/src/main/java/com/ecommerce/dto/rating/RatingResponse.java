package com.ecommerce.dto.rating;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class RatingResponse {

    private UUID id;
    private UUID productId;
    private UUID customerId;
    private BigDecimal ratingValue;
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public RatingResponse(UUID id, UUID productId, UUID customerId, BigDecimal ratingValue, String comment, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.productId = productId;
        this.customerId = customerId;
        this.ratingValue = ratingValue;
        this.comment = comment;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public BigDecimal getRatingValue() {
        return ratingValue;
    }

    public String getComment() {
        return comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setRatingValue(BigDecimal ratingValue) {
        this.ratingValue = ratingValue;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public UUID getProductId() {
        return productId;
    }

    public void setProductId(UUID productId) {
        this.productId = productId;
    }

    public UUID getCustomerId() {
        return customerId;
    }

    public void setCustomerId(UUID customerId) {
        this.customerId = customerId;
    }

}
