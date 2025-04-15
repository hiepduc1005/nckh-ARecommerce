package com.ecommerce.vn.dto.order;

import java.util.UUID;

import com.ecommerce.vn.entity.order.OrderStatus;

public class OrderStatusUpdateCreateRequest {

	private UUID orderId;
	
	private OrderStatus orderStatus;

	public UUID getOrderId() {
		return orderId;
	}

	public void setOrderId(UUID orderId) {
		this.orderId = orderId;
	}

	public OrderStatus getOrderStatus() {
		return orderStatus;
	}

	public void setOrderStatus(OrderStatus orderStatus) {
		this.orderStatus = orderStatus;
	}
	
	
}
