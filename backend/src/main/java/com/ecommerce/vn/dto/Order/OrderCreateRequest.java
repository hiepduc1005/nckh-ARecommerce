package com.ecommerce.vn.dto.order;

import java.util.List;
import java.util.UUID;

import com.ecommerce.vn.entity.order.PaymentMethod;

public class OrderCreateRequest {
	private UUID userId;
	private String couponCode;
    private List<OrderItemCreateRequest> orderItemCreateRequests;
	private PaymentMethod paymentMethod;
    private String notes;
	public UUID getUserId() {
		return userId;
	}
	public void setUserId(UUID userId) {
		this.userId = userId;
	}
	public String getCouponCode() {
		return couponCode;
	}
	public void setCouponCode(String couponCode) {
		this.couponCode = couponCode;
	}
	public List<OrderItemCreateRequest> getOrderItemCreateRequests() {
		return orderItemCreateRequests;
	}
	public void setOrderItemCreateRequests(List<OrderItemCreateRequest> orderItemCreateRequests) {
		this.orderItemCreateRequests = orderItemCreateRequests;
	}
	public PaymentMethod getPaymentMethod() {
		return paymentMethod;
	}
	public void setPaymentMethod(PaymentMethod paymentMethod) {
		this.paymentMethod = paymentMethod;
	}
	public String getNotes() {
		return notes;
	}
	public void setNotes(String notes) {
		this.notes = notes;
	}
    
    
}
