package com.ecommerce.dto.Order;

import java.math.BigDecimal;

import com.ecommerce.entity.order.OrderStatus;

public class OrderUpdateRequest {

    private BigDecimal totalAmount;
    private String shippingAddress;
    private String notes;
    private OrderStatus orderStatus;

    // Getters and Setters
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

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(OrderStatus orderStatus) {
        this.orderStatus = orderStatus;
    }

}
