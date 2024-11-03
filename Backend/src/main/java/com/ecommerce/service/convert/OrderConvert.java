package com.ecommerce.service.convert;

import com.ecommerce.dto.Order.OrderCreateRequest;
import com.ecommerce.dto.Order.OrderResponse;
import com.ecommerce.dto.Order.OrderUpdateRequest;
import com.ecommerce.entity.order.Order;

public class OrderConvert {

    public Order orderCreateRequestConvert(OrderCreateRequest request) {
        if (request == null) {
            return null;
        }

        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setTotalAmount(request.getTotalAmount());
        order.setShippingAddress(request.getShippingAddress());
        order.setNotes(request.getNotes());

        return order;
    }

    public Order orderUpdateRequestConvert(OrderUpdateRequest request, Order order) {
        if (request == null || order == null) {
            return null;
        }

        order.setTotalAmount(request.getTotalAmount());
        order.setShippingAddress(request.getShippingAddress());
        order.setNotes(request.getNotes());
        order.setOrderStatus(request.getOrderStatus());

        return order;
    }

    public OrderResponse orderConvertToOrderResponse(Order order) {
        if (order == null) {
            return null;
        }

        return new OrderResponse(
                order.getId(),
                order.getUserId(),
                order.getTotalAmount(),
                order.getShippingAddress(),
                order.getNotes(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                order.getOrderStatus()
        );
    }
}
