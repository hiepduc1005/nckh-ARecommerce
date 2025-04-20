package com.ecommerce.vn.service.convert;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.ratting.RatingCreateRequest;
import com.ecommerce.vn.dto.ratting.RatingResponse;
import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.rating.Rating;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.service.product.ProductService;
import com.ecommerce.vn.service.user.UserService;

@Service
public class RatingConvert {
	
	@Autowired
	private UserConvert userConvert;
	
	@Autowired
	private ProductService productService;
	
	@Autowired
	private UserService userService;
	
	public RatingResponse ratingConvertToRatingResponse(Rating rating) {
		if(rating == null) {
			return null;
		}
		RatingResponse ratingResponse = new RatingResponse();
		ratingResponse.setId(rating.getId());
		ratingResponse.setProductId(rating.getProduct().getId());
		ratingResponse.setRatingValue(rating.getRatingValue());
		ratingResponse.setComment(rating.getComment());
		ratingResponse.setIsVerified(rating.getIsVerified());
		ratingResponse.setCreatedAt(rating.getCreatedAt());
		ratingResponse.setUserResponse(userConvert.userConvertToUserResponse(rating.getUser()));
		ratingResponse.setUpdatedAt(rating.getUpdatedAt());
		List<String> images = rating.getImages().stream().map((image) -> image.getImageUrl()).toList();
		ratingResponse.setImagePaths(images);
		return ratingResponse;
	}
	
	public Rating ratingCreateRequestConvertToRating(RatingCreateRequest ratingCreateRequest) {
		Rating rating = new Rating();
		rating.setComment(ratingCreateRequest.getComment());
		rating.setRatingValue(ratingCreateRequest.getRatingValue());
		rating.setIsVerified(true);
		
		User user = userService.findUserByUuId(ratingCreateRequest.getUserId());
		Product product = productService.getProductById(ratingCreateRequest.getProductId());
		
		rating.setProduct(product);
		rating.setUser(user);
		
		return rating;
	}
}
