package com.ecommerce.vn.dto.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.ecommerce.vn.dto.coupon.CouponResponse;
import com.ecommerce.vn.entity.order.OrderStatus;
import com.ecommerce.vn.entity.order.PaymentMethod;

public class OrderResponse {

	private UUID id;
	private CouponResponse couponResponse;
	private OrderStatus orderStatus;
	private PaymentMethod paymentMethod;
	private String code;
	private LocalDateTime createdAt;
	private LocalDateTime orderApprovedAt;
	private LocalDateTime orderExpireAt;
	private String address;
	private String specificAddress;
	private String email;
	private String phone;
    private String notes;
    private String paymentUrl;
    private List<OrderItemResponse> orderItems = new ArrayList<OrderItemResponse>();
    private BigDecimal totalPrice;
    private BigDecimal discountPrice;
    private BigDecimal shippingFee;
    
    
    
	public String getPaymentUrl() {
		return paymentUrl;
	}
	public void setPaymentUrl(String paymentUrl) {
		this.paymentUrl = paymentUrl;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public LocalDateTime getOrderExpireAt() {
		return orderExpireAt;
	}
	public void setOrderExpireAt(LocalDateTime orderExpireAt) {
		this.orderExpireAt = orderExpireAt;
	}
	public UUID getId() {
		return id;
	}
	public void setId(UUID id) {
		this.id = id;
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
	public CouponResponse getCouponResponse() {
		return couponResponse;
	}
	public void setCouponResponse(CouponResponse couponResponse) {
		this.couponResponse = couponResponse;
	}
	public OrderStatus getOrderStatus() {
		return orderStatus;
	}
	public void setOrderStatus(OrderStatus orderStatus) {
		this.orderStatus = orderStatus;
	}
	public PaymentMethod getPaymentMethod() {
		return paymentMethod;
	}
	public void setPaymentMethod(PaymentMethod paymentMethod) {
		this.paymentMethod = paymentMethod;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public LocalDateTime getOrderApprovedAt() {
		return orderApprovedAt;
	}
	public void setOrderApprovedAt(LocalDateTime orderApprovedAt) {
		this.orderApprovedAt = orderApprovedAt;
	}
	public String getNotes() {
		return notes;
	}
	public void setNotes(String notes) {
		this.notes = notes;
	}
	
	public List<OrderItemResponse> getOrderItems() {
		return orderItems;
	}
	public void setOrderItems(List<OrderItemResponse> orderItems) {
		this.orderItems = orderItems;
	}
	public BigDecimal getTotalPrice() {
		return totalPrice;
	}
	public void setTotalPrice(BigDecimal totalPrice) {
		this.totalPrice = totalPrice;
	}
	public BigDecimal getDiscountPrice() {
		return discountPrice;
	}
	public void setDiscountPrice(BigDecimal discountPrice) {
		this.discountPrice = discountPrice;
	}
	public BigDecimal getShippingFee() {
		return shippingFee;
	}
	public void setShippingFee(BigDecimal shippingFee) {
		this.shippingFee = shippingFee;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
    
    

}
