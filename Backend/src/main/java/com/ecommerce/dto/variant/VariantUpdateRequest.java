package com.ecommerce.dto.variant;

import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;

import com.ecommerce.entity.attribute.AttributeValue;

public class VariantUpdateRequest {

    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer quantity;
    private UUID updatedBy;
    private Set<AttributeValue> attributeValue;

    public VariantUpdateRequest(BigDecimal price, BigDecimal discountPrice, Integer quantity, UUID updatedBy,
            Set<AttributeValue> attributeValue) {
        this.price = price;
        this.discountPrice = discountPrice;
        this.quantity = quantity;
        this.updatedBy = updatedBy;
        this.attributeValue = attributeValue;
    }

    // Getters và Setters
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

    public UUID getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(UUID updatedBy) {
        this.updatedBy = updatedBy;
    }

    public Set<AttributeValue> getAttributeValue() {
        return attributeValue;
    }

    public void setAttributeValue(Set<AttributeValue> attributeValue) {
        this.attributeValue = attributeValue;
    }

}
