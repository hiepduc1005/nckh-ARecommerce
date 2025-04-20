package com.ecommerce.vn.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.vn.dto.ratting.ProductRatingResponse;
import com.ecommerce.vn.dto.ratting.RatingCreateRequest;
import com.ecommerce.vn.dto.ratting.RatingResponse;
import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.rating.Rating;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.service.convert.RatingConvert;
import com.ecommerce.vn.service.rating.RatingService;
import com.ecommerce.vn.service.user.UserService;

@RestController
@RequestMapping("api/v1/rating")
public class RatingController {
	
	@Autowired
	private RatingService ratingService;

	@Autowired
	private RatingConvert ratingConvert;
	
	@Autowired
	private UserService userService;
	
	private static final double MIN_RATING = 1.0;
	private static final double MAX_RATING = 5.0;
	
	@PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
	public ResponseEntity<RatingResponse> createRating(
			@RequestPart("rating") RatingCreateRequest ratingCreateRequest,
			@RequestPart(name = "images", required = false) MultipartFile[] images
			){
		Rating rating = ratingConvert.ratingCreateRequestConvertToRating(ratingCreateRequest);
		
		rating = ratingService.createRating(rating,images);
		
		RatingResponse ratingResponse = ratingConvert.ratingConvertToRatingResponse(rating);
		
		return ResponseEntity.ok(ratingResponse);
	}
	
	@GetMapping("/{ratingId}")
	public ResponseEntity<RatingResponse> getRatingById(@PathVariable("ratingId") UUID ratingId){
		Rating rating = ratingService.getRatingById(ratingId);
		
		RatingResponse ratingResponse = ratingConvert.ratingConvertToRatingResponse(rating);
	
		return ResponseEntity.ok(ratingResponse);
	
	}
	
	@GetMapping("/user/product/{productId}")
	public ResponseEntity<RatingResponse> getUserRatingProduct(@PathVariable("productId") UUID productId){
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = userService.findUserByEmail(email);
		Product product = new Product();
		product.setId(productId);
		
		Rating rating = ratingService.getUserRatingProduct(user, product);
		if (rating == null) {
	        return ResponseEntity.noContent().build();
	    }
		RatingResponse ratingResponse = ratingConvert.ratingConvertToRatingResponse(rating);
	
		return ResponseEntity.ok(ratingResponse);
	
	}
	
	@GetMapping("/user-rated/product/{productId}")
	public ResponseEntity<Boolean> checkUserRatedProduct(@PathVariable("productId") UUID productId){
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = userService.findUserByEmail(email);
		Product product = new Product();
		product.setId(productId);
		
		Boolean isUserRated = ratingService.hasCustomerRatedProduct(product, user);
		
	
		return ResponseEntity.ok(isUserRated);
	
	}
	
	
	
	@GetMapping("/product/{productId}")
	public ResponseEntity<ProductRatingResponse> getRatingByProduct(
			@PathVariable("productId") UUID productId,
			@RequestParam(value = "value", required = false) Double ratingValue,
			@RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "8", required = false) int size){
		

		Page<Rating> ratings;
		if (ratingValue != null && ratingValue >= MIN_RATING && ratingValue <= MAX_RATING) {
			ratings = ratingService.getRatingsByProductAndValue(productId, ratingValue, page, size);
		}else {
			ratings = ratingService.getRatingsByProduct(productId, page, size);
		}
		Page<RatingResponse> ratingResponses = 
				ratings.map((rating) -> ratingConvert.ratingConvertToRatingResponse(rating));
				
		Double average = ratingService.getAverageRatingByProduct(productId);
		Map<Integer, Long> distribution = ratingService.getRatingDistributionByProduct(productId);
		Long total = ratingService.getTotalRatingsByProduct(productId);
		ProductRatingResponse response = new ProductRatingResponse(ratingResponses, average,total, distribution);
	
		return ResponseEntity.ok(response);
	
	}
	
	 @GetMapping("/product/{productId}/pagination")
	    public ResponseEntity<Page<RatingResponse>> getProductRatingsWithPaginationAndSorting(
	            @RequestParam("page") int page,
	            @RequestParam("size") int size,
	            @RequestParam(value ="sortBy" , required = false) String sortBy) {
	    	
	    	Page<Rating> ratings = ratingService.getProductsWithPaginationAndSorting(page, size, sortBy);
	        
	    	Page<RatingResponse> ratingsResponse = ratings.map(rating -> ratingConvert.ratingConvertToRatingResponse(rating));
	    	return new ResponseEntity<>(ratingsResponse, HttpStatus.OK);
	    }
	
	@GetMapping("/users/{userId}")
	public ResponseEntity<List<RatingResponse>> getRatingByUser(@PathVariable("userId") UUID userId){
		List<Rating> ratings = ratingService.getRatingsByUser(userId);
		
		List<RatingResponse> ratingResponses = ratings.stream()
				.map((rating) -> ratingConvert.ratingConvertToRatingResponse(rating))
				.toList();
	
		return ResponseEntity.ok(ratingResponses);
	
	}
	
	@DeleteMapping("/{ratingId}")
	public ResponseEntity<String> deleteRating(@PathVariable("ratingId") UUID ratingId){
		ratingService.deleteRating(ratingId);
		
		return ResponseEntity.ok("delete rating success!");
	}
}
