package com.ecommerce.vn.service.convert;

import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.coupon.CouponResponse;
import com.ecommerce.vn.entity.coupon.Coupon;

@Service
public class CouponConvert {

	public CouponResponse couponConvertToCouponResponse(Coupon coupon) {
		CouponResponse couponResponse = new CouponResponse();
		couponResponse.setId(coupon.getId());
		couponResponse.setCode(coupon.getCode());
		couponResponse.setCouponDescription(coupon.getCouponDescription());
		couponResponse.setCouponType(coupon.getCouponType());
		couponResponse.setCouponEndDate(coupon.getCouponEndDate());
		couponResponse.setCouponStartDate(coupon.getCouponStartDate());
		couponResponse.setDiscountType(coupon.getDiscountType());
		couponResponse.setDiscountValue(coupon.getDiscountValue());
		couponResponse.setMaxUsage(coupon.getMaxUsage());
		couponResponse.setMinimumOrderAmount(coupon.getMinimumOrderAmount());
		couponResponse.setCreatedAt(coupon.getCreatedAt());
		couponResponse.setUpdateAt(coupon.getUpdateAt());
		couponResponse.setTimeUsed(coupon.getTimeUsed());
		couponResponse.setUpdatedBy(coupon.getUpdatedBy());
		couponResponse.setCreatedBy(coupon.getCreatedBy());
		
		return couponResponse;
	}
}
