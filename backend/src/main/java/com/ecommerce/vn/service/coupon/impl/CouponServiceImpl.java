package com.ecommerce.vn.service.coupon.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.ecommerce.vn.entity.coupon.Coupon;
import com.ecommerce.vn.entity.product.DiscountType;
import com.ecommerce.vn.entity.seller.Seller;
import com.ecommerce.vn.exception.InvalidCouponException;
import com.ecommerce.vn.exception.ResourceNotFoundException;
import com.ecommerce.vn.repository.CouponRepository;
import com.ecommerce.vn.repository.SellerRepository;
import com.ecommerce.vn.service.coupon.CouponService;

@Service
public class CouponServiceImpl implements CouponService {

    SellerRepository sellerRepository;
    private final CouponRepository couponRepository;

    public CouponServiceImpl(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @Override
    @Transactional
    public Coupon createCoupon(Coupon coupon) {
        return couponRepository.save(coupon);
    }

    @Override
    @Transactional
    public Coupon updateCoupon(UUID couponId, Coupon updatedCoupon) {
        Coupon existingCoupon = couponRepository.findById(couponId)
            .orElseThrow(() -> new ResourceNotFoundException("Coupon", "couponId", couponId));
        
        // Cập nhật các trường của coupon
        existingCoupon.setCode(updatedCoupon.getCode());
        existingCoupon.setCoupondDescription(updatedCoupon.getCoupondDescription());
        existingCoupon.setDiscountValue(updatedCoupon.getDiscountValue());
        existingCoupon.setDiscountType(updatedCoupon.getDiscountType());
        existingCoupon.setCouponType(updatedCoupon.getCouponType());
        existingCoupon.setMinimumOrderAmount(updatedCoupon.getMinimumOrderAmount());
        existingCoupon.setMaxUsage(updatedCoupon.getMaxUsage());
        existingCoupon.setCouponStartDate(updatedCoupon.getCouponStartDate());
        existingCoupon.setCouponEndDate(updatedCoupon.getCouponEndDate());
        existingCoupon.setUpdateAt(updatedCoupon.getUpdateAt());
        existingCoupon.setUpdatedBy(updatedCoupon.getUpdatedBy());
        
        return couponRepository.save(existingCoupon);
    }

    @Override
    @Transactional
    public void deleteCoupon(UUID couponId) {
        Coupon coupon = couponRepository.findById(couponId)
            .orElseThrow(() -> new ResourceNotFoundException("Coupon", "couponId", couponId));
        
        couponRepository.delete(coupon);
    }

    @Override
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    @Override
    public Coupon getCouponById(UUID couponId) {
        return couponRepository.findById(couponId)
            .orElseThrow(() -> new ResourceNotFoundException("Coupon", "couponId", couponId));
    }

    @Override
    @Transactional
    public Coupon createCouponForSeller(UUID sellerId, Coupon coupon) {
       Seller seller = sellerRepository.findById(sellerId)
            .orElseThrow(() -> new ResourceNotFoundException("Seller", "sellerId", sellerId));
    coupon.setSeller(seller); 

    coupon.setCreatedBy(sellerId);
    
        return couponRepository.save(coupon);
    }

	@Override
	@Transactional(readOnly = true)
	public List<Coupon> searchCoupons(String keyword) {
		return couponRepository.searchCoupons(keyword);
	}

	@Override
	@Transactional
	public List<Coupon> getCouponsBySellerId(UUID sellerId) {
		Seller seller = sellerRepository.findById(sellerId)
		            .orElseThrow(() -> new ResourceNotFoundException("Seller", "sellerId", sellerId));
		return seller.getCoupons().stream().toList();
	}

	@Override
	@Transactional
	public boolean isCouponValid(UUID couponId, BigDecimal cartTotal) {
	    Coupon coupon = getCouponById(couponId);
	    LocalDateTime now = LocalDateTime.now();

	    // Kiểm tra ngày bắt đầu và kết thúc của coupon
	    if (now.isBefore(coupon.getCouponStartDate())) {
	        throw new InvalidCouponException("Coupon is not yet active.");
	    }
	    if (now.isAfter(coupon.getCouponEndDate())) {
	        throw new InvalidCouponException("Coupon has expired.");
	    }

	    // Kiểm tra điều kiện số lần sử dụng tối đa
	    if (coupon.getTimeUsed() >= coupon.getMaxUsage()) {
	        throw new InvalidCouponException("Coupon usage limit reached.");
	    }

	    // Kiểm tra điều kiện giá trị đơn hàng tối thiểu
	    if (coupon.getDiscountType().equals(DiscountType.FIXED_AMOUNT)) {
	        if (coupon.getMinimumOrderAmount() != null && cartTotal.compareTo(new BigDecimal(coupon.getMinimumOrderAmount())) < 0) {
	            throw new InvalidCouponException("Total amount is less than the minimum order amount for this coupon.");
	        }
	    }

	    return true;
	}


	@Override
	@Transactional
	public void incrementUsageCount(UUID couponId) {
		Coupon coupon = getCouponById(couponId);
		
		if (coupon.getTimeUsed() >= coupon.getMaxUsage()) {
		       throw new IllegalStateException("Coupon has reached its maximum usage limit.");
		   }
		
		   coupon.setTimeUsed(coupon.getTimeUsed() + 1);
		   couponRepository.save(coupon); 
	}

	@Override
	@Transactional
	public Coupon validateAndRetrieveCouponByCode(String couponCode,BigDecimal cartTotal) {
		 Coupon coupon = couponRepository.findByCode(couponCode)
		            .orElseThrow(() -> new InvalidCouponException("Invalid coupon code."));
		    
	     isCouponValid(coupon.getId(), cartTotal);
	    
	     return coupon;
	}

	@Override
	@Transactional
	public Coupon validateAndRetrieveCouponById(UUID couponId, BigDecimal cartTotal) {
		 Coupon coupon = couponRepository.findById(couponId)
		            .orElseThrow(() -> new InvalidCouponException("Invalid coupon id."));
		    
	    isCouponValid(couponId, cartTotal);
	    
	    return coupon;
	}

	@Override
	@Transactional
	public BigDecimal getTotalPriceAfterDiscount(UUID couponId, BigDecimal totalPrice) {
		Coupon coupon = validateAndRetrieveCouponById(couponId, totalPrice);
		BigDecimal discountAmount = BigDecimal.ZERO;

	    if (coupon.getDiscountType().equals(DiscountType.FIXED_AMOUNT)) {
	        discountAmount = coupon.getDiscountValue();
	    } else if (coupon.getDiscountType().equals(DiscountType.PERCENTAGE)) {
	        BigDecimal discountRate = coupon.getDiscountValue();
	        discountAmount = totalPrice.multiply(discountRate.divide(new BigDecimal(100)));
	    }

	    BigDecimal totalPriceAfterDiscount = totalPrice.subtract(discountAmount);

	    if (totalPriceAfterDiscount.compareTo(BigDecimal.ZERO) < 0) {
	        totalPriceAfterDiscount = BigDecimal.ZERO;
	    }

	    return totalPriceAfterDiscount;
	}
	
	
}

