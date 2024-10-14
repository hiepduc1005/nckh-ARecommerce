package com.ecommerce.vn.service.rating;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.ecommerce.vn.entity.rating.Rating;

public interface RatingService {

    Rating createRating(UUID productId, UUID sellerId, UUID customerId, BigDecimal ratingValue, String comment);

    Rating updateRating(UUID ratingId, BigDecimal ratingValue, String comment);

    void deleteRating(UUID ratingId);

    Rating getRatingById(UUID ratingId);

    List<Rating> getRatingsByProduct(UUID productId);

    List<Rating> getRatingsByCustomer(UUID customerId);

    List<Rating> getRatingsBySeller(UUID sellerId);
    
    BigDecimal getAverageRatingByProduct(UUID productId);

    // Lấy tổng số luot xếp hạng của sản phẩm
    Long getTotalRatingsByProduct(UUID productId);

    // Kiểm tra xem khách hàng đã xếp hạng sản phẩm chưa
    boolean hasCustomerRatedProduct(UUID productId, UUID customerId);  
}