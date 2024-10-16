package com.ecommerce.vn.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.entity.rating.Rating;

@Repository
public interface RatingRepository extends JpaRepository<Rating, UUID>{
    List<Rating> findByProductId(UUID productId);

    List<Rating> findByCustomerId(UUID customerId);

    List<Rating> findBySellerId(UUID sellerId);
    
    @Query("SELECT COUNT(r) > 0"
    		+ "FROM Rating r WHERE r.product.id = :productId AND r.customer.id = :customerId")
    boolean existsByProductIdAndCustomerId(@Param("productId") UUID productId, @Param("customerId") UUID customerId);
}
