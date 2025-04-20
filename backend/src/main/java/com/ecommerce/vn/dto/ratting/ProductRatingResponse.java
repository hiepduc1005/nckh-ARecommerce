package com.ecommerce.vn.dto.ratting;

import org.springframework.data.domain.Page;

import java.util.Map;

public class ProductRatingResponse {
    private Page<RatingResponse> ratings; // Paginated list of ratings
    private Double average; // Average rating value
    private Long total; // Total number of ratings
    private Map<Integer, Long> distribution; // Distribution of ratings (e.g., {1: 10, 2: 20, 3: 30, 4: 25, 5: 15})

    // Constructors
    public ProductRatingResponse() {}

    public ProductRatingResponse(Page<RatingResponse> ratings, Double average, Long total, Map<Integer, Long> distribution) {
        this.ratings = ratings;
        this.average = average;
        this.total = total;
        this.distribution = distribution;
    }

    // Getters and Setters
    public Page<RatingResponse> getRatings() {
        return ratings;
    }

    public void setRatings(Page<RatingResponse> ratings) {
        this.ratings = ratings;
    }

    public Double getAverage() {
        return average;
    }

    public void setAverage(Double average) {
        this.average = average;
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }

    public Map<Integer, Long> getDistribution() {
        return distribution;
    }

    public void setDistribution(Map<Integer, Long> distribution) {
        this.distribution = distribution;
    }
}