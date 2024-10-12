package com.ecommerce.vn.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.entity.seller.Seller;


@Repository
public interface SellerRepository extends JpaRepository<Seller, UUID>{
    Optional<Seller> findByShopName(String shopName);
    
    @Query("SELECT s FROM Seller s WHERE s.active = :active")
    List<Seller> findSellersByActive(@Param("active") Boolean active);
    
    @Query("SELECT COUNT(DISTINCT o) FROM Order o JOIN o.products p WHERE p.seller.id = :sellerId")
    Long countOrderBySellerId(@Param("sellerId") UUID sellerId);
    
    @Query(value = "SELECT SUM(or.price * oi.quantity) FROM orders o "
    		+ "JOIN order_items oi ON oi.order_id = o.id "
    		+ "JOIN products p ON oi.product_id = p.id "
    		+ "WHERE p.seller_id = :sellerId",nativeQuery = true)
    Long totalSalesBySeller(@Param("sellerId") UUID sellerId);
    
    @Query("SELECT s FROM Seller s JOIN s.user u WHERE u.email = :email")
    Optional<Seller> findSellerByEmail(@Param("email") String email);
    
    @Query("SELECT s FROM Seller s JOIN s.user u WHERE u.phoneNumber = :phoneNum")
    Optional<Seller> findSellerByPhonenum(@Param("phoneNum") String phoneNum);

} 
