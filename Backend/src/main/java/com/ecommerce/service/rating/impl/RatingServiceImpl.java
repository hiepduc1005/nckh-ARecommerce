package com.ecommerce.service.rating.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.entity.rating.Rating;
import com.ecommerce.repository.RatingRepository;
import com.ecommerce.service.rating.RatingService;

@Service
public class RatingServiceImpl implements RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Override
    public Rating createRating(UUID productId, UUID customerId, BigDecimal ratingValue, String comment) {
        Rating rating = new Rating();
        rating.setProductId(productId);
        rating.setCustomerId(customerId);
        rating.setRatingValue(ratingValue);
        rating.setComment(comment);
        rating.setIsVerified(true);

        return ratingRepository.save(rating);
    }

    @Override
    public Rating updateRating(UUID ratingId, BigDecimal ratingValue, String comment) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating", "id", ratingId));

        rating.setRatingValue(ratingValue);
        rating.setComment(comment);
        rating.setUpdatedAt(LocalDateTime.now());

        return ratingRepository.save(rating);
    }

    @Override
    public void deleteRating(UUID ratingId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating", "id", ratingId));

        ratingRepository.delete(rating);
    }

    @Override
    public Rating getRatingById(UUID ratingId) {
        return ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating", "id", ratingId));
    }

    @Override
    public List<Rating> getRatingsByProduct(UUID productId) {
        return ratingRepository.findByProductId(productId);
    }

    @Override
    public List<Rating> getRatingsByCustomer(UUID customerId) {
        return ratingRepository.findByCustomerId(customerId);
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getAverageRatingByProduct(UUID productId) {
        List<Rating> ratings = getRatingsByProduct(productId);

        return ratings.stream()
                .map(Rating::getRatingValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(new BigDecimal(ratings.size()), 2, RoundingMode.HALF_UP);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getTotalRatingsByProduct(UUID productId) {
        List<Rating> ratings = getRatingsByProduct(productId);

        return Long.valueOf(ratings.size());
    }

    @Override
    @Transactional
    public boolean hasCustomerRatedProduct(UUID productId, UUID customerId) {
        return ratingRepository.existsByProductIdAndCustomerId(productId, customerId);
    }
}
