package com.ecommerce.service.convert;

import com.ecommerce.dto.coupon.CouponCreateRequest;
import com.ecommerce.dto.coupon.CouponResponse;
import com.ecommerce.dto.coupon.CouponUpdateRequest;
import com.ecommerce.entity.coupon.Coupon;

public class CouponConvert {

    public Coupon couponCreateRequestConvert(CouponCreateRequest couponCreateRequest) {
        if (couponCreateRequest != null) {
            return null;
        }

        Coupon coupon = new Coupon();
        coupon.setCode(couponCreateRequest.getCode());
        coupon.setCoupondDescription(couponCreateRequest.getCouponDescription());
        coupon.setDiscountValue(couponCreateRequest.getDiscountValue());
        coupon.setDiscountType(couponCreateRequest.getDiscountType());
        coupon.setCouponType(couponCreateRequest.getCouponType());
        coupon.setMinimumOrderAmount(couponCreateRequest.getMinimumOrderAmount());
        coupon.setMaxUsage(couponCreateRequest.getMaxUsage());
        coupon.setCouponStartDate(couponCreateRequest.getCouponStartDate());
        coupon.setCouponEndDate(couponCreateRequest.getCouponEndDate());

        return coupon;
    }

    public Coupon couponUpdateConvert(CouponUpdateRequest couponUpdateRequest, Coupon coupon) {
        if (couponUpdateRequest == null || coupon == null) {
            return null;
        }

        coupon.setCoupondDescription(couponUpdateRequest.getCouponDescription());
        coupon.setDiscountValue(couponUpdateRequest.getDiscountValue());
        coupon.setMinimumOrderAmount(couponUpdateRequest.getMinimumOrderAmount());
        coupon.setMaxUsage(couponUpdateRequest.getMaxUsage());
        coupon.setCouponStartDate(couponUpdateRequest.getCouponStartDate());
        coupon.setCouponEndDate(couponUpdateRequest.getCouponEndDate());

        return coupon;
    }

    public CouponResponse couponConvertToCouponResponse(Coupon coupon) {
        if (coupon == null) {
            return null;
        }

        return new CouponResponse(
                coupon.getCode(),
                coupon.getCoupondDescription(),
                coupon.getCouponEndDate(),
                coupon.getCouponStartDate(),
                coupon.getCouponType(),
                coupon.getCreatedAt(),
                coupon.getDiscountType(),
                coupon.getDiscountValue(),
                coupon.getId(),
                coupon.getMaxUsage(),
                coupon.getMinimumOrderAmount(),
                coupon.getTimeUsed(),
                coupon.getUpdateAt()
        );
    }
}
