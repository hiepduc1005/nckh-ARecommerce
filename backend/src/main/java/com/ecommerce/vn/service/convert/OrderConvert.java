package com.ecommerce.vn.service.convert;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.order.OrderCreateRequest;
import com.ecommerce.vn.dto.order.OrderItemResponse;
import com.ecommerce.vn.dto.order.OrderResponse;
import com.ecommerce.vn.entity.coupon.Coupon;
import com.ecommerce.vn.entity.order.Order;
import com.ecommerce.vn.entity.order.OrderItem;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.service.coupon.CouponService;
import com.ecommerce.vn.service.user.UserService;

@Service
public class OrderConvert {
 
	@Autowired
	private UserService userService;
	
	@Autowired
	private CouponService couponService;
	
	@Autowired
	private OrderItemConvert orderItemConvert;
	
	@Autowired
	private CouponConvert couponConvert;
	
	
	public Order orderCreateConvertToOrder(OrderCreateRequest orderCreateRequest) {
		if(orderCreateRequest == null) {
			return null;
		}
		Order order = new Order();
		String couponCode = orderCreateRequest.getCouponCode();
		if(!couponCode.isEmpty()) {
			Coupon coupon = couponService.getCouponByCode(couponCode);
			order.setCoupon(coupon);
		}
		
		User user = userService.findUserByUuId(orderCreateRequest.getUserId());
		order.setUser(user);
		
		order.setNotes(orderCreateRequest.getNotes());
		order.setPaymentMethod(orderCreateRequest.getPaymentMethod());
		
		List<OrderItem> orderItems = orderCreateRequest.getOrderItemCreateRequests()
				.stream()
				.map((orderItem) -> orderItemConvert.orderItemCreateConvertToOrderItem(orderItem))
				.toList();
		
		order.setOrderItems(orderItems);
		
		return order;
		
	}
	
	public OrderResponse orderConvertToOrderResponse(Order order) {
		if(order == null) {
			return null;
		}
		OrderResponse orderResponse = new OrderResponse();
		Coupon coupon = order.getCoupon();
		if(coupon != null) {
			orderResponse.setCouponResponse(couponConvert.couponConvertToCouponResponse(coupon));
		}
		
		orderResponse.setCode(order.getCode());
		orderResponse.setId(order.getId());
		orderResponse.setCreatedAt(order.getCreatedAt());
		orderResponse.setOrderApprovedAt(order.getOrderApprovedAt());
		orderResponse.setDiscountPrice(order.getDiscountPrice());
		orderResponse.setTotalPrice(order.getTotalPrice());
		orderResponse.setNotes(order.getNotes());
		orderResponse.setPaymentMethod(order.getPaymentMethod());
		orderResponse.setShippingFee(order.getShippingFee());
		orderResponse.setUserId(order.getUser().getId());
		
		List<OrderItemResponse> orderItemResponses = order.getOrderItems()
				.stream()
				.map((orderItem) -> orderItemConvert.orderItemConvertToOrderItemResponse(orderItem))
				.toList();
		
		orderResponse.setOrderItems(orderItemResponses);
		orderResponse.setOrderStatus(order.getOrderStatus());
		
		return orderResponse;
	}

}
