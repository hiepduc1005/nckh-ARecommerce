package com.ecommerce.vn.service.rating.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.rating.Rating;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.repository.RatingRepository;
import com.ecommerce.vn.service.product.ProductService;
import com.ecommerce.vn.service.rating.RatingService;
import com.ecommerce.vn.service.user.UserService;

@Service
@Transactional
public class RatingServiceImpl implements RatingService {
	
	@Autowired
	private RatingRepository ratingRepository;
	
	@Autowired
	private ProductService productService;
	
	@Autowired
	private UserService userService;

	@Override
	public Rating createRating(Rating rating) {
		Product product = rating.getProduct();
		
	    User user = rating.getUser();
	    
	    if(product != null && user != null) {
	    	
	    	
    		Optional<Rating> ratingOp = ratingRepository.findByUserInProduct(product,user);
    		
    		if(ratingOp.isPresent()) {
    			return updateRating(ratingOp.get().getId(), rating.getRatingValue(), rating.getComment());	
    		}	    	
	    	
	    	return ratingRepository.save(rating);
	    }
	    
	    throw new RuntimeException("Some thing error");
	}

	@Override
	public Rating updateRating(UUID ratingId, Double ratingValue, String comment) {
		Rating rating = getRatingById(ratingId);
		rating.setComment(comment);
		rating.setRatingValue(ratingValue);
		return ratingRepository.save(rating);
	}

	@Override
	public void deleteRating(UUID ratingId) {
		Rating rating = getRatingById(ratingId);
		
		ratingRepository.delete(rating);
	}

	@Override
	public Rating getRatingById(UUID ratingId) {
		if(ratingId == null) {
			throw new RuntimeException("Rating id missing");
		}
		return ratingRepository.findById(ratingId).orElseThrow(() -> 
				new RuntimeException("Cant not found rating with id " + ratingId));
	}

	@Override
	public List<Rating> getRatingsByProduct(UUID productId) {
		Product product = productService.getProductById(productId);
		return ratingRepository.findByProduct(product);
	}
	
	@Override
	public List<Rating> getRatingsByUser(UUID userId) {
		User user = userService.findUserByUuId(userId);
		return ratingRepository.findByUser(user);
	}
	
	@Override
	public Double getAverageRatingByProduct(UUID productId) {
		Product product = productService.getProductById(productId);
		Double result = ratingRepository.getAverageByProduct(product);
		return result != null ? result : 0;
	}

	@Override
	public Long getTotalRatingsByProduct(UUID productId) {
		Product product = productService.getProductById(productId);
		return Long.valueOf(product.getRatings().size());
	}

	@Override
	public boolean hasCustomerRatedProduct(Product product, User user) {
		// TODO Auto-generated method stub
		return false;
	}



	
}
