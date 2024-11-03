package com.ecommerce.dto.variant;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import com.ecommerce.entity.attribute.AttributeValue;
import com.ecommerce.entity.product.Product;

public class VariantResponse {

    private UUID id;
    private Product Product;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer quantity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UUID createdBy;
    private UUID updatedBy;
    private Set<AttributeValue> attributeValue;
    
    // Getters và Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getDiscountPrice() {
        return discountPrice;
    }

    public void setDiscountPrice(BigDecimal discountPrice) {
        this.discountPrice = discountPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
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

    public Product getProduct() {
        return Product;

    }

    public void setProduct(Product product) {
        Product = product;
    }

    public Set<AttributeValue> getAttributeValue() {
        return attributeValue;
    }

    public void setAttributeValue(Set<AttributeValue> attributeValue) {
        this.attributeValue = attributeValue;
    }

    public VariantResponse(UUID id, com.ecommerce.entity.product.Product product, BigDecimal price,
            BigDecimal discountPrice, Integer quantity, LocalDateTime createdAt, LocalDateTime updatedAt,
            UUID createdBy, UUID updatedBy, Set<AttributeValue> attributeValue) {
        this.id = id;
        Product = product;
        this.price = price;
        this.discountPrice = discountPrice;
        this.quantity = quantity;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.attributeValue = attributeValue;
    }

}
