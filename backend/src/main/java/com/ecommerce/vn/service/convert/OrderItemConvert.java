package com.ecommerce.vn.service.convert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.order.OrderItemCreateRequest;
import com.ecommerce.vn.dto.order.OrderItemResponse;
import com.ecommerce.vn.entity.order.Order;
import com.ecommerce.vn.entity.order.OrderItem;
import com.ecommerce.vn.entity.product.Variant;
import com.ecommerce.vn.service.variant.VariantService;

@Service
public class OrderItemConvert {
	
	@Autowired
	private VariantService variantService;
	
	@Autowired
	private VariantConvert variantConvert;
	
	public OrderItem orderItemCreateConvertToOrderItem(OrderItemCreateRequest orderCreateRequest, Order order) {
		Variant variant = variantService.getVariantById(orderCreateRequest.getVariantId());
		OrderItem orderItem = new OrderItem();
		orderItem.setVariant(variant);
		orderItem.setQuantity(orderCreateRequest.getQuantity());
		orderItem.setOrder(order);
		return orderItem;
	}
	
	public OrderItemResponse orderItemConvertToOrderItemResponse(OrderItem orderItem) {
		OrderItemResponse orderItemResponse = new OrderItemResponse();
		orderItemResponse.setId(orderItem.getId());
		orderItemResponse.setQuantity(orderItem.getQuantity());
		orderItemResponse.setVariantResponse(variantConvert.variantConvertToVariantResponse(orderItem.getVariant()));
		
		return orderItemResponse;
	}
	
	
}
