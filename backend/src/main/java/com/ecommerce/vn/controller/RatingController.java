package com.ecommerce.vn.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.vn.dto.ratting.RatingCreateRequest;
import com.ecommerce.vn.dto.ratting.RatingResponse;
import com.ecommerce.vn.entity.rating.Rating;
import com.ecommerce.vn.service.convert.RatingConvert;
import com.ecommerce.vn.service.rating.RatingService;

@RestController
@RequestMapping("api/v1/rating")
public class RatingController {
	
	@Autowired
	private RatingService ratingService;

	@Autowired
	private RatingConvert ratingConvert;
	
	@PostMapping
	public ResponseEntity<RatingResponse> createRating(@RequestBody RatingCreateRequest ratingCreateRequest){
		Rating rating = ratingConvert.ratingCreateRequestConvertToRating(ratingCreateRequest);
		
		rating = ratingService.createRating(rating);
		
		RatingResponse ratingResponse = ratingConvert.ratingConvertToRatingResponse(rating);
		
		return ResponseEntity.ok(ratingResponse);
	}
	
	@GetMapping("/{ratingId}")
	public ResponseEntity<RatingResponse> getRatingById(@PathVariable("ratingId") UUID ratingId){
		Rating rating = ratingService.getRatingById(ratingId);
		
		RatingResponse ratingResponse = ratingConvert.ratingConvertToRatingResponse(rating);
	
		return ResponseEntity.ok(ratingResponse);
	
	}
	
	@GetMapping("/products/{productId}")
	public ResponseEntity<List<RatingResponse>> getRatingByProduct(@PathVariable("productId") UUID productId){
		List<Rating> ratings = ratingService.getRatingsByProduct(productId);
		
		List<RatingResponse> ratingResponses = ratings.stream()
				.map((rating) -> ratingConvert.ratingConvertToRatingResponse(rating))
				.toList();
	
		return ResponseEntity.ok(ratingResponses);
	
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
