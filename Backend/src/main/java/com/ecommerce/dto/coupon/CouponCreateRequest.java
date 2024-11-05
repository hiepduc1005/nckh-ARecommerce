package com.ecommerce.dto.coupon;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.ecommerce.entity.coupon.CouponType;
import com.ecommerce.entity.product.DiscountType;

public class CouponCreateRequest {

    private String code;
    private String couponDescription;
    private BigDecimal discountValue;
    private DiscountType discountType;
    private CouponType couponType;
    private Integer minimumOrderAmount;
    private Integer maxUsage;
    private LocalDateTime couponStartDate;
    private LocalDateTime couponEndDate;

    // Getters and Setters
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

}
