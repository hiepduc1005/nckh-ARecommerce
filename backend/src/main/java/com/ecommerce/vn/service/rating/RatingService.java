package com.ecommerce.vn.service.rating;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.rating.Rating;
import com.ecommerce.vn.entity.user.User;

public interface RatingService {

    Rating createRating(Rating rating, MultipartFile[] images);

    Rating updateRating(UUID ratingId, Double ratingValue, String comment, MultipartFile[] images);

    void deleteRating(UUID ratingId);

    Rating getRatingById(UUID ratingId);
    

    Page<Rating> getRatingsByProduct(UUID productId, int page, int size);
    
    Page<Rating> getRatingsByProductAndValue(UUID productId, Double ratingValue,  int page, int size);


    List<Rating> getRatingsByUser(UUID userId);
    
    Rating getUserRatingProduct(User user, Product product);
    
    Double getAverageRatingByProduct(UUID productId);
    
    Map<Integer, Long> getRatingDistributionByProduct(UUID productId);

    // Lấy tổng số luot xếp hạng của sản phẩm
    Long getTotalRatingsByProduct(UUID productId);

    // Kiểm tra xem khách hàng đã xếp hạng sản phẩm chưa
    boolean hasCustomerRatedProduct(Product product, User user);

	Page<Rating> getProductsWithPaginationAndSorting(int page, int size, String sortBy);  
}