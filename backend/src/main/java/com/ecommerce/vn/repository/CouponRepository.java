package com.ecommerce.vn.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.entity.coupon.Coupon;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, UUID>{

    @Query("SELECT c FROM Coupon c WHERE c.code LIKE %:keyword% OR c.couponDescription LIKE %:keyword%")
    List<Coupon> searchCoupons(@Param("keyword") String keyword);

    List<Coupon> findBySellerId(UUID sellerId);
    
    Optional<Coupon> findByCode(String couponCode);
}
