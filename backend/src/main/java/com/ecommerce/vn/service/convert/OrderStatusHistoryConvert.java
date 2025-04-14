package com.ecommerce.vn.service.convert;

import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.order.OrderStatusHistoryResponse;
import com.ecommerce.vn.entity.order.OrderStatusHistory;

@Service
public class OrderStatusHistoryConvert {

	public OrderStatusHistoryResponse orderStatusHistoryConvertToOrderStatusHistoryResponse(OrderStatusHistory orderStatusHistory) {
		OrderStatusHistoryResponse orderStatusHistoryResponse = new OrderStatusHistoryResponse();
		orderStatusHistoryResponse.setId(orderStatusHistory.getId());
		orderStatusHistoryResponse.setNote(orderStatusHistory.getNote());
		orderStatusHistoryResponse.setStatus(orderStatusHistory.getStatus());
		orderStatusHistoryResponse.setUpdatedAt(orderStatusHistory.getUpdatedAt());
		orderStatusHistoryResponse.setUpdatedBy(orderStatusHistory.getUpdatedBy());
		
		return orderStatusHistoryResponse;
	}
}
