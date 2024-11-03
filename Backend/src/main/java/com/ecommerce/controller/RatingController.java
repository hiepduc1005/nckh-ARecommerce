package com.ecommerce.controller;

import com.ecommerce.dto.rating.RatingCreateRequest;
import com.ecommerce.dto.rating.RatingResponse;
import com.ecommerce.dto.rating.RatingUpdateRequest;
import com.ecommerce.entity.rating.Rating;
import com.ecommerce.service.rating.RatingService;
import com.ecommerce.service.convert.RatingConvert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @Autowired
    private RatingConvert ratingConvert;

    // Tạo một rating mới
    @PostMapping
    public ResponseEntity<RatingResponse> createRating(@RequestBody RatingCreateRequest request) {
        Rating rating = ratingService.createRating(request.getProductId(), request.getCustomerId(), request.getRatingValue(), request.getComment());
        RatingResponse response = ratingConvert.ratingConvertToRatingResponse(rating);
        return ResponseEntity.status(201).body(response);
    }

    // Cập nhật một rating
    @PutMapping("/{ratingId}")
    public ResponseEntity<RatingResponse> updateRating(@PathVariable UUID ratingId, @RequestBody RatingUpdateRequest request) {
        Rating updatedRating = ratingService.updateRating(ratingId, request.getRatingValue(), request.getComment());
        RatingResponse response = ratingConvert.ratingConvertToRatingResponse(updatedRating);
        return ResponseEntity.ok(response);
    }

    // Xóa một rating
    @DeleteMapping("/{ratingId}")
    public ResponseEntity<Void> deleteRating(@PathVariable UUID ratingId) {
        ratingService.deleteRating(ratingId);
        return ResponseEntity.noContent().build();
    }

    // Lấy thông tin chi tiết của một rating
    @GetMapping("/{ratingId}")
    public ResponseEntity<RatingResponse> getRatingById(@PathVariable UUID ratingId) {
        Rating rating = ratingService.getRatingById(ratingId);
        RatingResponse response = ratingConvert.ratingConvertToRatingResponse(rating);
        return ResponseEntity.ok(response);
    }

    // Lấy danh sách rating của một sản phẩm
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<RatingResponse>> getRatingsByProduct(@PathVariable UUID productId) {
        List<Rating> ratings = ratingService.getRatingsByProduct(productId);
        List<RatingResponse> responses = ratings.stream()
                .map(ratingConvert::ratingConvertToRatingResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Lấy danh sách rating của một khách hàng
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<RatingResponse>> getRatingsByCustomer(@PathVariable UUID customerId) {
        List<Rating> ratings = ratingService.getRatingsByCustomer(customerId);
        List<RatingResponse> responses = ratings.stream()
                .map(ratingConvert::ratingConvertToRatingResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Lấy đánh giá trung bình của một sản phẩm
    @GetMapping("/product/{productId}/average")
    public ResponseEntity<BigDecimal> getAverageRatingByProduct(@PathVariable UUID productId) {
        BigDecimal averageRating = ratingService.getAverageRatingByProduct(productId);
        return ResponseEntity.ok(averageRating);
    }

    // Lấy tổng số lượt xếp hạng của một sản phẩm
    @GetMapping("/product/{productId}/total")
    public ResponseEntity<Long> getTotalRatingsByProduct(@PathVariable UUID productId) {
        Long totalRatings = ratingService.getTotalRatingsByProduct(productId);
        return ResponseEntity.ok(totalRatings);
    }

    // Kiểm tra xem khách hàng đã xếp hạng sản phẩm chưa
    @GetMapping("/product/{productId}/customer/{customerId}/hasRated")
    public ResponseEntity<Boolean> hasCustomerRatedProduct(@PathVariable UUID productId, @PathVariable UUID customerId) {
        boolean hasRated = ratingService.hasCustomerRatedProduct(productId, customerId);
        return ResponseEntity.ok(hasRated);
    }
}
