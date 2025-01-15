package com.ecommerce.vn.dto.coupon;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.ecommerce.vn.entity.coupon.CouponType;
import com.ecommerce.vn.entity.product.DiscountType;

public class CouponResponse {

	private UUID id;
	private String code;
	private String couponDescription;
	private BigDecimal discountValue;
	private DiscountType discountType;
	private CouponType couponType;
	private Double minimumOrderAmount;
	private Integer timeUsed;
	private Integer maxUsage;
	private LocalDateTime couponStartDate;
	private LocalDateTime couponEndDate;
	private LocalDateTime createdAt;
	private LocalDateTime updateAt;
	private UUID createdBy;
	private UUID updatedBy;
	public UUID getId() {
		return id;
	}
	public void setId(UUID id) {
		this.id = id;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getCouponDescription() {
		return couponDescription;
	}
	public void setCouponDescription(String couponDescription) {
		this.couponDescription = couponDescription;
	}
	public BigDecimal getDiscountValue() {
		return discountValue;
	}
	public void setDiscountValue(BigDecimal discountValue) {
		this.discountValue = discountValue;
	}
	public DiscountType getDiscountType() {
		return discountType;
	}
	public void setDiscountType(DiscountType discountType) {
		this.discountType = discountType;
	}
	public CouponType getCouponType() {
		return couponType;
	}
	public void setCouponType(CouponType couponType) {
		this.couponType = couponType;
	}
	public Double getMinimumOrderAmount() {
		return minimumOrderAmount;
	}
	public void setMinimumOrderAmount(Double minimumOrderAmount) {
		this.minimumOrderAmount = minimumOrderAmount;
	}
	public Integer getTimeUsed() {
		return timeUsed;
	}
	public void setTimeUsed(Integer timeUsed) {
		this.timeUsed = timeUsed;
	}
	public Integer getMaxUsage() {
		return maxUsage;
	}
	public void setMaxUsage(Integer maxUsage) {
		this.maxUsage = maxUsage;
	}
	public LocalDateTime getCouponStartDate() {
		return couponStartDate;
	}
	public void setCouponStartDate(LocalDateTime couponStartDate) {
		this.couponStartDate = couponStartDate;
	}
	public LocalDateTime getCouponEndDate() {
		return couponEndDate;
	}
	public void setCouponEndDate(LocalDateTime couponEndDate) {
		this.couponEndDate = couponEndDate;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public LocalDateTime getUpdateAt() {
		return updateAt;
	}
	public void setUpdateAt(LocalDateTime updateAt) {
		this.updateAt = updateAt;
	}
	public UUID getCreatedBy() {
		return createdBy;
	}
	public void setCreatedBy(UUID createdBy) {
		this.createdBy = createdBy;
	}
	public UUID getUpdatedBy() {
		return updatedBy;
	}
	public void setUpdatedBy(UUID updatedBy) {
		this.updatedBy = updatedBy;
	}

}
