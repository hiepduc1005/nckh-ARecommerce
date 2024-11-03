package com.ecommerce.dto.rating;

import java.math.BigDecimal;

public class RatingUpdateRequest {

    private BigDecimal ratingValue;
    private String comment;

    // Getters and Setters
    public BigDecimal getRatingValue() {
        return ratingValue;
    }

    public void setRatingValue(BigDecimal ratingValue) {
        this.ratingValue = ratingValue;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
