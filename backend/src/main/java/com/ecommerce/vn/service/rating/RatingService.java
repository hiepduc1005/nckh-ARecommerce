package com.ecommerce.vn.service.rating;

import java.util.List;
import java.util.UUID;

import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.rating.Rating;
import com.ecommerce.vn.entity.user.User;

public interface RatingService {

    Rating createRating(Rating rating);

    Rating updateRating(UUID ratingId, Double ratingValue, String comment);

    void deleteRating(UUID ratingId);

    Rating getRatingById(UUID ratingId);
    

    List<Rating> getRatingsByProduct(UUID productId);

    List<Rating> getRatingsByUser(UUID userId);
    
    Double getAverageRatingByProduct(UUID productId);

    // Lấy tổng số luot xếp hạng của sản phẩm
    Long getTotalRatingsByProduct(UUID productId);

    // Kiểm tra xem khách hàng đã xếp hạng sản phẩm chưa
    boolean hasCustomerRatedProduct(Product product, User user);  
}