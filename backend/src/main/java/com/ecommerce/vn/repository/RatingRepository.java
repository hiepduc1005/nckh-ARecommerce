package com.ecommerce.vn.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.rating.Rating;
import com.ecommerce.vn.entity.user.User;

@Repository
public interface RatingRepository extends JpaRepository<Rating, UUID>{
    List<Rating> findByProductId(UUID productId);

    List<Rating> findByCustomerId(UUID customerId);

    List<Rating> findBySellerId(UUID sellerId);
    
    @Query("SELECT COUNT(r) > 0"
    		+ "FROM Rating r WHERE r.product.id = :productId AND r.customer.id = :customerId")
    boolean existsByProductIdAndCustomerId(@Param("productId") UUID productId, @Param("customerId") UUID customerId);

    @Query("SELECT r FROM Rating r WHERE r.user = :user")
    List<Rating> findByUser(@Param("user") User user);
    
    @Query("SELECT r FROM Rating r WHERE r.product = :product")
    List<Rating> findByProduct(@Param("product") Product product);
    
    @Query("SELECT r FROM Rating r WHERE r.user = :user AND r.product = :product")
    Optional<Rating> findByUserInProduct(@Param("product") Product product ,@Param("user") User user);
    
    @Query("SELECT AVG(r.ratingValue) FROM Rating r WHERE r.product = :product")
    Double getAverageByProduct(@Param("product") Product product);

}
