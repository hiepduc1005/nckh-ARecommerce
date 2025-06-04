package com.ecommerce.vn.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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


    @Query("SELECT r FROM Rating r WHERE r.user = :user")
    List<Rating> findByUser(@Param("user") User user);
    
    @Query("SELECT r FROM Rating r WHERE r.product = :product")
    Page<Rating> findByProduct(@Param("product") Product product, Pageable pageable);
    
    @Query("SELECT r FROM Rating r WHERE r.user = :user AND r.product = :product")
    Optional<Rating> findByUserInProduct(@Param("product") Product product ,@Param("user") User user);
    
    @Query("SELECT AVG(r.ratingValue) FROM Rating r WHERE r.product = :product")
    Double getAverageByProduct(@Param("product") Product product);
    
    @Query("SELECT AVG(r.ratingValue) FROM Rating r WHERE r.product.id = :productId")
    Double findAverageRatingByProductId(@Param("productId") UUID productId);
    
    boolean existsByUserIdAndProductId(UUID userId, UUID productId);

    
    long countByProductId(UUID productId);
    
    long countByCommentIsNotNull();
    
    long countByIsVerifiedTrue();
    
    @Query("SELECT AVG(r.ratingValue) FROM Rating r")
    Double findAverageRating();
    
    @Query("SELECT COUNT(DISTINCT r) FROM Rating r WHERE SIZE(r.images) > 0")
    long countRatingsWithImages();
    
    List<Rating> findByProductIdAndIsVerifiedTrue(UUID productId);



    @Query("SELECT COUNT(*) FROM Rating r WHERE r.user = :user AND r.product = :product")
    Long isUserRatedThisProduct(@Param("product") Product product ,@Param("user") User user);

    @Query("SELECT r.ratingValue, COUNT(r) FROM Rating r WHERE r.product = :product GROUP BY r.ratingValue")
    List<Object[]> getRatingDistributionRaw(@Param("product")  Product product);

    
    @Query("SELECT r FROM Rating r WHERE r.product = :product AND r.ratingValue = :ratingValue")
    Page<Rating> findByProductAndValue(@Param("product") Product product, @Param("ratingValue") Double ratingValue, Pageable pageable);
}
