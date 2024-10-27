package com.ecommerce.entity.order;

public enum OrderStatus {
    PENDING, // Đơn hàng đang chờ xử lý
    APPROVED, // Đơn hàng đã được phê duyệt
    SHIPPED, // Đơn hàng đã được vận chuyển
    PAID, // Đơn hàng đã tra tien
    DELIVERED, // Đơn hàng đã được giao
    CANCELED, // Đơn hàng bị hủy bỏ
    RETURNED, // Đơn hàng đã được trả lại
    REJECTED         // Đơn hàng bi tu choi
}
