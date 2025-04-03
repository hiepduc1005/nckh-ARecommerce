package com.ecommerce.vn.dto.order;

import java.util.List;

import com.ecommerce.vn.entity.order.PaymentMethod;

public class OrderCreateRequest {
	private String email;
	private String couponCode;
	private String address;
	private String phone;
	private String specificAddress;
    private List<OrderItemCreateRequest> orderItemCreateRequests;
	private PaymentMethod paymentMethod;
    private String notes;
  
    
    
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getSpecificAddress() {
		return specificAddress;
	}
	public void setSpecificAddress(String specificAddress) {
		this.specificAddress = specificAddress;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
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
