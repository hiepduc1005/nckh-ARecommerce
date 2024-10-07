package com.ecommerce.vn.entity.order;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.annotation.CreatedDate;

import com.ecommerce.vn.entity.coupon.Coupon;
import com.ecommerce.vn.entity.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class Order {
	
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne
	@JoinColumn(name = "order_coupon_id")
	private Coupon coupon;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "order_status",nullable = false)
	private OrderStatus orderStatus;
	
	@OneToMany(mappedBy = "order",fetch = FetchType.LAZY)
	private Set<OrderItem> orderItems = new HashSet<OrderItem>();
	
	@CreatedDate
	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;
	
	@Column(name = "order_approved_at")
	private LocalDateTime orderApprovedAt;
	
	@Column(name = "order_delivered_carrier_date")
	private LocalDateTime orderDeliveredCarrierDate;
	
	@Column(name = "order_delivered_user_date")
	private LocalDateTime orderDeliveredUserDate;
	
	

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public LocalDateTime getOrderDeliveredUserDate() {
		return orderDeliveredUserDate;
	}

	public void setOrderDeliveredUserDate(LocalDateTime orderDeliveredUserDate) {
		this.orderDeliveredUserDate = orderDeliveredUserDate;
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	

	public Coupon getCoupon() {
		return coupon;
	}

	public void setCoupon(Coupon coupon) {
		this.coupon = coupon;
	}

	public OrderStatus getOrderStatus() {
		return orderStatus;
	}

	public void setOrderStatus(OrderStatus orderStatus) {
		this.orderStatus = orderStatus;
	}

	public Set<OrderItem> getOrderItems() {
		return orderItems;
	}

	public void setOrderItems(Set<OrderItem> orderItems) {
		this.orderItems = orderItems;
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

	public LocalDateTime getOrderDeliveredCarrierDate() {
		return orderDeliveredCarrierDate;
	}

	public void setOrderDeliveredCarrierDate(LocalDateTime orderDeliveredCarrierDate) {
		this.orderDeliveredCarrierDate = orderDeliveredCarrierDate;
	}

	
	
	

}
