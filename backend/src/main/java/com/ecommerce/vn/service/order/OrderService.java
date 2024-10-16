package com.ecommerce.vn.service.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.ecommerce.vn.entity.coupon.Coupon;
import com.ecommerce.vn.entity.order.Order;
import com.ecommerce.vn.entity.order.OrderStatus;

public interface OrderService {
    Order createOrder(Order order,String couponCode);

    Order getOrderById(UUID orderId);

    List<Order> getAllOrders();

    Order updateOrder( Order updatedOrder);

    void deleteOrder(UUID orderId);

    Order updateOrderStatus(UUID orderId, OrderStatus orderStatus);

    Order addCouponToOrder(UUID orderId, Coupon coupon);

    BigDecimal calculateTotalPriceWithCoupon(UUID orderId,UUID couponId);

    Order addNotes(UUID orderId, String notes);
    
    List<Order> getOrdersByUserId(UUID userId);

    List<Order> getOrdersByStatus(OrderStatus status);

    List<Order> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    BigDecimal calculateTotalShippingFee(UUID userId, LocalDateTime startDate, LocalDateTime endDate);

    Order cancelOrder(UUID orderId);

    List<Order> getPaidOrders();
    
    BigDecimal calculateTotalPrice(Order order);
    
    Order updateTotalPrice(Order order);
    
    Order updateTotalPriceWithCoupon(Order order,Coupon coupon);
    
    Boolean isOrderEmpty(Order order);

}
