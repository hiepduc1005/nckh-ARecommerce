package com.ecommerce.dto.coupon;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.ecommerce.entity.coupon.CouponType;
import com.ecommerce.entity.product.DiscountType;

public class CouponResponse {

    private UUID id;
    private String code;
    private String couponDescription;
    private BigDecimal discountValue;
    private DiscountType discountType;
    private CouponType couponType;
    private Integer minimumOrderAmount;
    private Integer timeUsed;
    private Integer maxUsage;
    private LocalDateTime couponStartDate;
    private LocalDateTime couponEndDate;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;

    public CouponResponse(String code, String couponDescription, LocalDateTime couponEndDate, LocalDateTime couponStartDate, CouponType couponType, LocalDateTime createdAt, DiscountType discountType, BigDecimal discountValue, UUID id, Integer maxUsage, Integer minimumOrderAmount, Integer timeUsed, LocalDateTime updateAt) {
        this.code = code;
        this.couponDescription = couponDescription;
        this.couponEndDate = couponEndDate;
        this.couponStartDate = couponStartDate;
        this.couponType = couponType;
        this.createdAt = createdAt;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.id = id;
        this.maxUsage = maxUsage;
        this.minimumOrderAmount = minimumOrderAmount;
        this.timeUsed = timeUsed;
        this.updateAt = updateAt;
    }

    // Getters and Setters
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

    public Integer getMinimumOrderAmount() {
        return minimumOrderAmount;
    }

    public void setMinimumOrderAmount(Integer minimumOrderAmount) {
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

}
