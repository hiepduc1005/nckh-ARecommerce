package com.ecommerce.vn.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.vn.dto.coupon.CouponCreateRequest;
import com.ecommerce.vn.dto.coupon.CouponResponse;
import com.ecommerce.vn.entity.coupon.Coupon;
import com.ecommerce.vn.service.convert.CouponConvert;
import com.ecommerce.vn.service.coupon.CouponService;

@RestController
@RequestMapping("api/v1/coupon")
public class CouponController {

	@Autowired
	private CouponService couponService;
	
	@Autowired
	private CouponConvert couponConvert;
	
	@PostMapping
	public ResponseEntity<CouponResponse> createCoupon(@RequestBody CouponCreateRequest couponCreateRequest){
		Coupon coupon = couponConvert.couponCreateRequestConvertToCoupon(couponCreateRequest);
		coupon = couponService.createCoupon(coupon);
		
		CouponResponse couponResponse = couponConvert.couponConvertToCouponResponse(coupon);
		
		return ResponseEntity.ok(couponResponse);
	} 
	
	@GetMapping("/{couponId}")
	public ResponseEntity<CouponResponse> getCouponById(@PathVariable("couponId") UUID couponId){
		Coupon coupon = couponService.getCouponById(couponId);
		CouponResponse couponResponse = couponConvert.couponConvertToCouponResponse(coupon);

		return ResponseEntity.ok(couponResponse);
	}  
	
	@GetMapping("/code/{couponCode}")
	public ResponseEntity<CouponResponse> getCouponByCode(@PathVariable("couponCode") String couponCode){
		Coupon coupon = couponService.getCouponByCode(couponCode);
		CouponResponse couponResponse = couponConvert.couponConvertToCouponResponse(coupon);

		return ResponseEntity.ok(couponResponse);
	} 
	
	@DeleteMapping("/{couponId}")
	public ResponseEntity<?> deleteCoupon(@PathVariable("couponId") UUID couponId){
		couponService.deleteCoupon(couponId);

		return ResponseEntity.ok("Delete coupon success!");
	} 
 }
