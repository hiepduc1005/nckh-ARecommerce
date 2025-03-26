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
	private UUID userId;
	private CouponResponse couponResponse;
	private OrderStatus orderStatus;
	private PaymentMethod paymentMethod;
	private String code;
	private LocalDateTime createdAt;
	private LocalDateTime orderApprovedAt;
    private String notes;
    private List<OrderItemResponse> orderItems = new ArrayList<OrderItemResponse>();
    private BigDecimal totalPrice;
    private BigDecimal discountPrice;
    private BigDecimal shippingFee;
	public UUID getId() {
		return id;
	}
	public void setId(UUID id) {
		this.id = id;
	}
	public UUID getUserId() {
		return userId;
	}
	public void setUserId(UUID userId) {
		this.userId = userId;
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
