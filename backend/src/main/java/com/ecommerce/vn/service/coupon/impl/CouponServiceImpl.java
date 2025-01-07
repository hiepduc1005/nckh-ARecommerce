package com.ecommerce.vn.service.coupon.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.ecommerce.vn.entity.coupon.Coupon;
import com.ecommerce.vn.repository.CouponRepository;
import com.ecommerce.vn.service.coupon.CouponService;

@Service
@Transactional
public class CouponServiceImpl implements CouponService {

	@Autowired
	private CouponRepository couponRepository;
	
	private String generateUniqueCouponCode() {
	    String code;
	    do {
	        code = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
	    } while (couponRepository.existsByCode(code)); // Kiểm tra mã đã tồn tại trong database
	    return code;
	}

	
	@Override
	public Coupon createCoupon(Coupon coupon) {
	    if (coupon.getCode() == null || coupon.getCode().isEmpty()) {
	        // Generate a unique code nếu người dùng không truyền mã code
	        coupon.setCode(generateUniqueCouponCode());
	    } else {
	        // Kiểm tra nếu mã code đã tồn tại
	        if (couponRepository.existsByCode(coupon.getCode())) {
	            throw new RuntimeException("Coupon code already exists!");
	        }
	    }
	    
	    
	    if(coupon.getCouponStartDate().isAfter(coupon.getCouponEndDate())) {
	    	throw new RuntimeException("Start date must not after end date");
	    }

	    // Lưu coupon mới vào database
	    return couponRepository.save(coupon);
	}

	@Override
	public Coupon updateCoupon(UUID couponId, Coupon updatedCoupon) {
		if(couponId == null) {
			throw new RuntimeException("Coupon id missing");
		}
		
		if (updatedCoupon.getCode() == null || updatedCoupon.getCode().isEmpty()) {
			updatedCoupon.setCode(generateUniqueCouponCode());
	    } else {
	        if (couponRepository.existsByCode(updatedCoupon.getCode())) {
	            throw new RuntimeException("Coupon code already exists!");
	        }
	    }
		
	   if(updatedCoupon.getCouponStartDate().isAfter(updatedCoupon.getCouponEndDate())) {
	    	throw new RuntimeException("Start date must not after end date");
	    }

	    return couponRepository.save(updatedCoupon);
	}

	@Override
	public void deleteCoupon(UUID couponId) {
		if(couponId == null) {
			throw new RuntimeException("Coupon id missing");
		}
		
		couponRepository.deleteById(couponId);
	}

	@Override
	public List<Coupon> getAllCoupons() {		
		return couponRepository.findAll();
	}

	@Override
	public Coupon getCouponById(UUID couponId) {
		if(couponId == null) {
			throw new RuntimeException("Coupon id missing");
		}
		
		return couponRepository.findById(couponId).orElseThrow(() ->
			new RuntimeException("Cant not found coupon with id: " + couponId));
	}

	@Override
	public List<Coupon> searchCoupons(String keyword) {
		// TODO Auto-generated method stub
		return couponRepository.searchCoupons(keyword);
	}

	@Override
	public boolean isCouponValid(UUID couponId) {
		Coupon coupon = getCouponById(couponId);
		
		int maxUsage = coupon.getMaxUsage();
		int timeUsed = coupon.getTimeUsed();
		
		if(timeUsed >= maxUsage) {
			return false;
		}
		
		LocalDateTime couponStartDate = coupon.getCouponStartDate();
	    LocalDateTime couponEndDate = coupon.getCouponEndDate();
	    LocalDateTime currentDate = LocalDateTime.now();

	    // Kiểm tra ngày bắt đầu và ngày kết thúc
	    if (currentDate.isBefore(couponStartDate) || currentDate.isAfter(couponEndDate)) {
	        return false;
	    }
	    
	    return true;
	}

	@Override
	public void incrementUsageCount(UUID couponId) {
		Coupon coupon = getCouponById(couponId);

		coupon.setTimeUsed(coupon.getTimeUsed() + 1);
		couponRepository.save(coupon);
		
	}


	@Override
	public Coupon getCouponByCode(String code) {
		return couponRepository.findByCode(code)
				.orElseThrow(() -> new RuntimeException("Coupon not found with code : " + code));
		
	}
	
	
}

