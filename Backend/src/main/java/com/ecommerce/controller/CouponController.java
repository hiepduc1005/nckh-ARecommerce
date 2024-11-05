package com.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.dto.coupon.CouponCreateRequest;
import com.ecommerce.dto.coupon.CouponResponse;
import com.ecommerce.dto.coupon.CouponUpdateRequest;
import com.ecommerce.entity.coupon.Coupon;
import com.ecommerce.service.convert.CouponConvert;
import com.ecommerce.service.coupon.CouponService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    @Autowired
    private CouponService couponService;

    @Autowired
    private CouponConvert couponConvert;

    @PostMapping
    public ResponseEntity<CouponResponse> createCoupon(@RequestBody CouponCreateRequest createRequest) {
        Coupon coupon = couponConvert.couponCreateRequestConvert(createRequest);
        Coupon createdCoupon = couponService.createCoupon(coupon);
        CouponResponse response = couponConvert.couponConvertToCouponResponse(createdCoupon);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CouponResponse> getCouponById(@PathVariable UUID id) {
        Coupon coupon = couponService.getCouponById(id);
        CouponResponse response = couponConvert.couponConvertToCouponResponse(coupon);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<CouponResponse>> getAllCoupons() {
        List<Coupon> coupons = couponService.getAllCoupons();
        List<CouponResponse> responses = coupons.stream()
                .map(couponConvert::couponConvertToCouponResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CouponResponse> updateCoupon(@PathVariable UUID id, @RequestBody CouponUpdateRequest updateRequest) {
        Coupon coupon = couponService.getCouponById(id);
        coupon.setCouponDescription(updateRequest.getCouponDescription());
        coupon.setDiscountValue(updateRequest.getDiscountValue());
        coupon.setMinimumOrderAmount(updateRequest.getMinimumOrderAmount());
        coupon.setMaxUsage(updateRequest.getMaxUsage());
        coupon.setCouponStartDate(updateRequest.getCouponStartDate());
        coupon.setCouponEndDate(updateRequest.getCouponEndDate());

        Coupon updatedCoupon = couponService.updateCoupon(id, coupon);
        CouponResponse response = couponConvert.couponConvertToCouponResponse(coupon);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable UUID id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }
}
