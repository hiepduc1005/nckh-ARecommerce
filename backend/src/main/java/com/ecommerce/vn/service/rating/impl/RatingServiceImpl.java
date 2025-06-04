package com.ecommerce.vn.service.rating.impl;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.rating.Rating;
import com.ecommerce.vn.entity.rating.RatingImage;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.repository.RatingRepository;
import com.ecommerce.vn.service.FileUploadService;
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
	
	@Autowired
	private FileUploadService fileUploadService;

	@Override
	public Rating createRating(Rating rating, MultipartFile[] images) {
		Product product = rating.getProduct();
		
	    User user = rating.getUser();
	    
	    if(product != null && user != null) {
	    	
	    	
    		Optional<Rating> ratingOp = ratingRepository.findByUserInProduct(product,user);
    		
    		if(ratingOp.isPresent()) {
    			return updateRating(ratingOp.get().getId(), rating.getRatingValue(), rating.getComment(),images);	
    		}	    
    		
    		if(images != null && images.length > 0 && images.length <= 5) {
    			Arrays.stream(images).forEach(image -> {
    				String imageUrl = fileUploadService.uploadFileToServer(image);
    				RatingImage ratingImage = new RatingImage();
    				ratingImage.setImageUrl(imageUrl);
    				rating.addImage(ratingImage);
    			});    			
    		}
	    	
	    	return ratingRepository.save(rating);
	    }
	    
	    throw new RuntimeException("Some thing error");
	}

	@Override
	public Rating updateRating(UUID ratingId, Double ratingValue, String comment, MultipartFile[] images) {
		Rating rating = getRatingById(ratingId);
		rating.setComment(comment);
		rating.setRatingValue(ratingValue);
		
		int remainingSlots = 5 - rating.getImages().size();

		if(images != null && images.length > 0 && remainingSlots > 0) {
			Arrays.stream(images).forEach(image -> {
				String imageUrl = fileUploadService.uploadFileToServer(image);
				RatingImage ratingImage = new RatingImage();
				ratingImage.setImageUrl(imageUrl);
				rating.addImage(ratingImage);
			});			
		}

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
	@Transactional(readOnly = true)
	public Page<Rating> getRatingsByProduct(UUID productId, int page, int size) {
		Product product = productService.getProductById(productId);
		Pageable pageable = PageRequest.of(page, size);

		return ratingRepository.findByProduct(product,pageable);
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
	    return ratingRepository.isUserRatedThisProduct(product, user) > 0;
	}

	@Override
	public Page<Rating> getProductsWithPaginationAndSorting(int page, int size, String sortBy) {
		Pageable pageable = PageRequest.of(page, size);
		return ratingRepository.findAll(pageable);
	}

	@Override
	@Transactional(readOnly = true)
	public Rating getUserRatingProduct(User user, Product product) {
		return  ratingRepository.findByUserInProduct(product,user).get();
	}

	@Override
	@Transactional(readOnly = true)
	public Page<Rating> getRatingsByProductAndValue(UUID productId, Double ratingValue, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		Product product = productService.getProductById(productId);

		return ratingRepository.findByProductAndValue(product, ratingValue, pageable);
	}

	@Override
	@Transactional(readOnly = true)
	public Map<Integer, Long> getRatingDistributionByProduct(UUID productId) {
		Product product = productService.getProductById(productId);

	    List<Object[]> rawDistribution = ratingRepository.getRatingDistributionRaw(product);
	    return rawDistribution.stream()
	            .collect(Collectors.toMap(
	                row -> ((Number) row[0]).intValue(),           // key
	                row -> ((Number) row[1]).longValue(),          // value
	                Long::sum                                       // merge function: cộng giá trị khi trùng key
	            ));
	}



	
}
