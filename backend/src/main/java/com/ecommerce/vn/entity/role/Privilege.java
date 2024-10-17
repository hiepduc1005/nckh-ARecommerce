package com.ecommerce.vn.entity.role;

public enum Privilege {
    // Quản lý người dùng
    MANAGE_USERS,           // Quản lý người dùng (tạo, sửa, xóa)
    VIEW_USER_PROFILE,      // Xem thông tin người dùng
    EDIT_USER_PROFILE,      // Chỉnh sửa thông tin người dùng
    MANAGE_USER_PROFILE,

    // Quản lý sản phẩm
    ADD_PRODUCT,            // Thêm sản phẩm mới
    EDIT_PRODUCT,           // Sửa thông tin sản phẩm
    DELETE_PRODUCT,         // Xóa sản phẩm
    VIEW_PRODUCT,           // Xem chi tiết sản phẩm
    MANAGE_PRODUCT_STOCK,   // Quản lý tồn kho sản phẩm

    // Quản lý đơn hàng
    CREATE_ORDER,           // Tạo đơn hàng
    VIEW_ORDER,             // Xem thông tin đơn hàng
    CANCEL_ORDER,           // Hủy đơn hàng
    UPDATE_ORDER_STATUS,    // Cập nhật trạng thái đơn hàng (VD: Đang vận chuyển, Đã giao hàng)
    
    // Quản lý thanh toán
    INITIATE_PAYMENT,       // Thực hiện thanh toán
    REFUND_PAYMENT,         // Hoàn tiền
    
    // Quản lý đánh giá sản phẩm
    ADD_REVIEW,             // Thêm đánh giá sản phẩm
    DELETE_REVIEW,          // Xóa đánh giá sản phẩm
    VIEW_REVIEWS,           // Xem đánh giá sản phẩm

    // Quản lý khuyến mãi
    CREATE_PROMOTION,       // Tạo chương trình khuyến mãi
    APPLY_PROMOTION,        // Áp dụng mã khuyến mãi
    DELETE_PROMOTION,       // Xóa chương trình khuyến mãi
    
    // Quản lý giao hàng
    VIEW_SHIPPING_DETAILS,  // Xem thông tin giao hàng
    UPDATE_SHIPPING_STATUS, // Cập nhật trạng thái giao hàng
    MANAGE_SHIPPING_POLICY,
    
    APPROVE_PRODUCT,
    APPROVE_SELLER,
    
    UPDATE_POLICY
}
