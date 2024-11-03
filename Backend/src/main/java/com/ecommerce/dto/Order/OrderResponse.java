package com.ecommerce.dto.Order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.ecommerce.entity.order.OrderStatus;

public class OrderResponse {

    private UUID id;
    private UUID userId;
    private BigDecimal totalAmount;
    private String shippingAddress;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private OrderStatus status;

    // Constructor
    public OrderResponse(UUID id, UUID userId, BigDecimal totalAmount, String shippingAddress,
            String notes, LocalDateTime createdAt, LocalDateTime updatedAt, OrderStatus orderStatus) {
        this.id = id;
        this.userId = userId;
        this.totalAmount = totalAmount;
        this.shippingAddress = shippingAddress;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.status = orderStatus;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
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

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    // Getters and Setters
}
