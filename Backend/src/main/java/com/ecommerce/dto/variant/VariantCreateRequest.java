package com.ecommerce.dto.variant;

import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;

import com.ecommerce.entity.attribute.AttributeValue;
import com.ecommerce.entity.product.Product;

public class VariantCreateRequest {

    private Product product;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer quantity;
    private UUID createdBy;
    private Set<AttributeValue> attributeValue;

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

    public UUID getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UUID createdBy) {
        this.createdBy = createdBy;
    }

    public Set<AttributeValue> getAttributeValue() {
        return attributeValue;
    }

    public void setAttributeValue(Set<AttributeValue> attributeValue) {
        this.attributeValue = attributeValue;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

}
