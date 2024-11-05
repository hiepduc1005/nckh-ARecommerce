package com.ecommerce.dto.coupon;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CouponUpdateRequest {

    private String couponDescription;
    private BigDecimal discountValue;
    private Integer minimumOrderAmount;
    private Integer maxUsage;
    private LocalDateTime couponStartDate;
    private LocalDateTime couponEndDate;

    // Getters and Setters
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
