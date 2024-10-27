package com.ecommerce.service.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.ecommerce.entity.coupon.Coupon;
import com.ecommerce.entity.order.Order;
import com.ecommerce.entity.order.OrderStatus;

public interface OrderService {
    Order createOrder(Order order);

    Order getOrderById(UUID orderId);

    List<Order> getAllOrders();

    Order updateOrder(UUID orderId, Order updatedOrder);

    void deleteOrder(UUID orderId);

    Order updateOrderStatus(UUID orderId, OrderStatus orderStatus);

    Order addCouponToOrder(UUID orderId, Coupon coupon);

    BigDecimal calculateTotalAmount(UUID orderId);

    Order addNotes(UUID orderId, String notes);
    
    List<Order> getOrdersByUserId(UUID userId);

    List<Order> getOrdersByStatus(OrderStatus status);

    List<Order> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    BigDecimal calculateTotalShippingFee(UUID userId, LocalDateTime startDate, LocalDateTime endDate);

    Order cancelOrder(UUID orderId);

    List<Order> getPaidOrders();
}
