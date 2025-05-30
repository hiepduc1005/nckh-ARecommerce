package com.ecommerce.vn.dto.order;

import java.util.ArrayList;
import java.util.List;

import com.ecommerce.vn.entity.order.PaymentMethod;

public class OrderCustomizeCreateRequest {
	private String email;
	private String couponCode;
	private String address;
	private String phone;
	private String specificAddress;
    private List<OrderItemCustomizeCreateRequest> orderItemCustomizeCreateRequests = new ArrayList<>();
	private PaymentMethod paymentMethod;
    private String notes;
	private Double shippingFee;

	public Double getShippingFee() {
		return shippingFee;
	}
	public void setShippingFee(Double shippingFee) {
		this.shippingFee = shippingFee;
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
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getSpecificAddress() {
		return specificAddress;
	}
	public void setSpecificAddress(String specificAddress) {
		this.specificAddress = specificAddress;
	}
	public List<OrderItemCustomizeCreateRequest> getOrderItemCustomizeCreateRequests() {
		return orderItemCustomizeCreateRequests;
	}
	public void setOrderItemCustomizeCreateRequests(
			List<OrderItemCustomizeCreateRequest> orderItemCustomizeCreateRequests) {
		this.orderItemCustomizeCreateRequests = orderItemCustomizeCreateRequests;
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
