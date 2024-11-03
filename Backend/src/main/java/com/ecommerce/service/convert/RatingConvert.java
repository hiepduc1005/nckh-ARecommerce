package com.ecommerce.service.convert;

import com.ecommerce.dto.rating.RatingCreateRequest;
import com.ecommerce.dto.rating.RatingResponse;
import com.ecommerce.dto.rating.RatingUpdateRequest;
import com.ecommerce.entity.rating.Rating;

public class RatingConvert {

    public Rating ratingCreateRequestConvert(RatingCreateRequest request) {
        if (request == null) {
            return null;
        }

        Rating rating = new Rating();

        rating.setProductId(request.getProductId());
        rating.setCustomerId(request.getCustomerId());
        rating.setRatingValue(request.getRatingValue());
        rating.setComment(request.getComment());

        return rating;
    }

    public Rating ratingUpdateRequestConvert(RatingUpdateRequest request, Rating rating) {
        if (request == null || rating == null) {
            return null;
        }
        rating.setRatingValue(request.getRatingValue());
        rating.setComment(request.getComment());
        return rating;
    }

    public RatingResponse ratingConvertToRatingResponse(Rating rating) {
        if (rating == null) {
            return null;
        }
        return new RatingResponse(
                rating.getId(),
                rating.getProductId(),
                rating.getCustomerId(),
                rating.getRatingValue(),
                rating.getComment(),
                rating.getCreatedAt(),
                rating.getUpdatedAt()
        );
    }
}
