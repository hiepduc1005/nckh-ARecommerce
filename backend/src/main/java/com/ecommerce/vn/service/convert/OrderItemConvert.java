package com.ecommerce.vn.service.convert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.order.OrderItemCreateRequest;
import com.ecommerce.vn.dto.order.OrderItemCustomizeCreateRequest;
import com.ecommerce.vn.dto.order.OrderItemResponse;
import com.ecommerce.vn.entity.order.Order;
import com.ecommerce.vn.entity.order.OrderItem;
import com.ecommerce.vn.entity.product.ModelDesign;
import com.ecommerce.vn.entity.product.Variant;
import com.ecommerce.vn.service.product.ModelDesignService;
import com.ecommerce.vn.service.variant.VariantService;

@Service
public class OrderItemConvert {
	
	@Autowired
	private VariantService variantService;
	
	@Autowired
	private VariantConvert variantConvert;
	
	@Autowired
	private ModelDesignService designService;
	
	@Autowired
	private ModelDesignConvert modelDesignConvert;
	
	
	public OrderItem orderItemCreateConvertToOrderItem(OrderItemCreateRequest orderCreateRequest, Order order) {
		Variant variant = variantService.getVariantById(orderCreateRequest.getVariantId());
		OrderItem orderItem = new OrderItem();
		orderItem.setVariant(variant);
		orderItem.setQuantity(orderCreateRequest.getQuantity());
		orderItem.setOrder(order);
		orderItem.setIsCustomized(false);
		orderItem.setModelDesign(null);
		return orderItem;
	}
	
	public OrderItem orderItemCustomizeCreateConvertToOrderItem(OrderItemCustomizeCreateRequest customizeCreateRequest, Order order) {
		ModelDesign modelDesign = designService.getModelDesignById(customizeCreateRequest.getDesignId());
		OrderItem orderItem = new OrderItem();
		orderItem.setModelDesign(modelDesign);
		orderItem.setIsCustomized(true);
		orderItem.setVariant(null);
		orderItem.setQuantity(customizeCreateRequest.getQuantity());
		orderItem.setOrder(order);
		return orderItem;
	}
	

	
	public OrderItemResponse orderItemConvertToOrderItemResponse(OrderItem orderItem) {
		OrderItemResponse orderItemResponse = new OrderItemResponse();
		orderItemResponse.setId(orderItem.getId());
		orderItemResponse.setQuantity(orderItem.getQuantity());
		if(orderItem.getModelDesign() != null) {
			orderItemResponse.setIsCustomized(true);
			orderItemResponse.setModelDesignResponse(modelDesignConvert.modelConvertToResponse(orderItem.getModelDesign()));
		}else {
			orderItemResponse.setVariantResponse(variantConvert.variantConvertToVariantResponse(orderItem.getVariant()));			
		}
		return orderItemResponse;
	}
	
	
}
