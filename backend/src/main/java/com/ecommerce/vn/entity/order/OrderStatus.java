package com.ecommerce.vn.entity.order;

public enum OrderStatus {
    PENDING,       // Đơn hàng vừa được tạo, đang chờ thanh toán (có thể có timeout 15 phút).
    CANCELLED,      // Đơn hàng bị hủy do người dùng hoặc hệ thống (hết hạn, lỗi thanh toán, v.v.).
    PAID,       // Đơn hàng đã được thanh toán thành công.
    PROCESSING,		   // Đơn hàng đang được xử lý (chuẩn bị hàng, xác nhận, v.v.).
    SHIPPED,     // Đơn hàng đã được giao cho đơn vị vận chuyển.
    DELIVERED,      // Đơn hàng đã giao thành công đến người mua.
    REFUNDED,       // Đơn hàng đã được hoàn tiền.
    
    ALL, //Tat ca trang thai
   
}