package com.ecommerce.vn.service.product.impl;

import java.math.BigDecimal;
import java.nio.ByteBuffer;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.vn.dto.product.ProductWithScore;
import com.ecommerce.vn.entity.order.Order;
import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.product.Tag;
import com.ecommerce.vn.repository.ProductRepository;
import com.ecommerce.vn.service.product.ProductService;

@Service
@Transactional
public class ProductServiceImpl implements ProductService{
	
	@Autowired
	private ProductRepository productRepository;
	
	@Override
	public Product createProduct(Product product) {		
		
		return productRepository.save(product);
	}

	@Override
	public Product updateProduct(Product productUpdate) {
		findProductByUuid(productUpdate.getId());
		
		return productRepository.save(productUpdate);
	}

	@Override	
	public Product findProductByUuid(UUID productId) {
		if(productId == null) {
			throw new RuntimeException("Product id missing");
		}
		
		return productRepository.findById(productId).orElseThrow(() -> 
				new RuntimeException()
				);
	}

	@Override
	public void deleteProduct(UUID productId) {
		Product product = getProductById(productId);
		product.setActive(false);
		updateProduct(product);
	}

	@Override
	@Transactional(readOnly = true )
	public List<Product> searchProducts(String keyword) {
		return productRepository.findByKeywordProducts(keyword);
	}

	@Override
	public Product updateProductImage(UUID productId, MultipartFile image) {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	@Transactional(readOnly = true )
	public Page<Product> getProductsWithPaginationAndSorting(int page, int size, String sortBy) {
		Pageable pageable = PageRequest.of(page, size);
		return productRepository.findAll(pageable);
	}
	
	@Override
	public Page<Product> filterProducts(List<String> categories, List<String> brands, BigDecimal minPrice,
			BigDecimal maxPrice, String keyword, int page, int size,String sort) {
		Pageable pageable;
		
		// Apply sorting based on the sort parameter
		if(sort != null && !sort.isEmpty()) {
			Sort pageSort = null;
			
			switch(sort) {
				case "latest":
					pageSort = Sort.by(Sort.Direction.DESC, "createdAt");
					break;
				case "oldest":
					pageSort = Sort.by(Sort.Direction.ASC, "createdAt");
					break;
				case "sold-quantity":
					pageSort = Sort.by(Sort.Direction.DESC, "soldQuantity"); 
					break;
//				case "rating-asc":
//					// If you have a rating field or calculated average in the Product entity
//					pageSort = Sort.by(Sort.Direction.ASC, "ratings.value"); 
//					break;
//				case "rating-desc":
//					pageSort = Sort.by(Sort.Direction.DESC, "ratings.value");
//					break;
//				case "price-asc":
//					// Assuming you want to sort by the minimum price of variants
//					pageSort = Sort.by(Sort.Direction.ASC, "variants.price");
//					break;
//				case "price-desc":
//					pageSort = Sort.by(Sort.Direction.DESC, "variants.price");
//					break;
				default:
					// Default sort if none specified
					pageSort = Sort.by(Sort.Direction.ASC, "createdAt");
			}
			
			pageable = PageRequest.of(page, size).withSort(pageSort);
		} else {
			// Default sort if sort parameter is empty
			pageable = PageRequest.of(page, size).withSort(Sort.by(Sort.Direction.DESC, "createdAt"));
		}
		
		return productRepository.filterProducts(categories, brands, minPrice, maxPrice, keyword , pageable);
	}

	@Override
	public Product getProductById(UUID productId) {
		if(productId == null) {
			throw new RuntimeException("Product id missing ");
		}
		return productRepository.findById(productId).orElseThrow(() -> 
				new RuntimeException("Product not found with id: " + productId) );
	}

	@Override
	public List<Product> getProductBySeller(UUID sellerId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Product> getAllProductUnactive() {
		// TODO Auto-generated method stub
		return productRepository.findProductsUnactive();
	}

	@Override
	public Product activateProduct(UUID productId) {
		Product product = getProductById(productId);
		product.setActive(true);
		return product;
	}

	@Override
	public Product deactiveProduct(UUID productId) {
		Product product = getProductById(productId);
		product.setActive(false);
		return product;
	}

	@Override
	public List<Product> getAllProducts() {
		// TODO Auto-generated method stub
		return productRepository.findAll();
	}

	
	@Override
	public Boolean isProductExist(UUID productId) {
		if(productId == null) {
			throw new RuntimeException("Product id missing ");
		}
		return productRepository.existsById(productId);
	}

	@Override
	@Transactional(readOnly = true )
	public List<Product> getRelatedProducts(UUID productId) {	
		if(isProductExist(productId)) {
			List<byte[]> relatedProducts = productRepository.findTop6RelatedProductIds(productId);			
			
			List<UUID> relatedProductsId =  relatedProducts.stream().map(related -> toUUID(related)).toList();
			
			List<Product> products = productRepository.findAllById(relatedProductsId);
			return products;
		}
		
		return new ArrayList<>();
	}

	@Override
	public List<Product> getProductByTag(Tag tag) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	@Transactional(readOnly = true )
	public Product getProductBySlug(String slug) {
		// TODO Auto-generated method stub
		return productRepository.getProductBySlug(slug)
				.orElseThrow(() -> new RuntimeException("Product with slug not exsit!"));
	}

	@Override
	@Transactional(readOnly = true )
	public Page<Product> getFeaturedProducts(Pageable pageable) {
		
		return productRepository.findProductsFeatured(pageable);
	}

//	@Async
	@Override
	public void updateSoldQuantity(Order order) {
		Boolean isCustomized = order.getOrderItems().get(0).getIsCustomized();
		if(!isCustomized) {
			order.getOrderItems().forEach((orderItem) -> {
				int quantity = orderItem.getQuantity();
				Product product = orderItem.getVariant().getProduct();
				int totalQuantity = product.getSoldQuantity();
				
				int newQuantity = totalQuantity + quantity;
				product.setSoldQuantity(newQuantity);
				
				updateProduct(product);
			});
		}
		
	}

	@Transactional
	@Override
	public void updateProductFeatured(List<Product> products) {
		products.forEach(product -> {
		        product.setIsFeatured(false);
		});

	    Set<UUID> featuredIds = new HashSet<>();
		LocalDateTime aWeekAgo = LocalDateTime.now().minusDays(7);
		
		List<Product> hotProducts = products.stream()
		        .filter(p -> p.getSoldQuantity() > 20 && p.getCreatedAt().isAfter(aWeekAgo))
		        .limit(8) // Giới hạn tối đa 8
		        .toList();
		
		hotProducts.forEach(product -> {
	        product.setIsFeatured(true);
	        featuredIds.add(product.getId());
	    });
		
		if(featuredIds.size() < 8) {
			int needed = 8 - featuredIds.size();
			
			List<Product> bestSellers = products.stream()
		            .filter(p -> !featuredIds.contains(p.getId())) // Loại bỏ đã chọn
		            .sorted(Comparator.comparingInt(Product::getSoldQuantity).reversed())
		            .limit(needed)
		            .toList();
		        
	        bestSellers.forEach(product -> {
	            product.setIsFeatured(true);
	            featuredIds.add(product.getId());
	        });
	        
		}
		
		List<Product> toUpdate = products.stream()
				.filter(p -> featuredIds.contains(p.getId()))
				.toList();
		
		productRepository.saveAll(toUpdate);

	} 
	
	
	private UUID toUUID(byte[] bytes) {
	    ByteBuffer bb = ByteBuffer.wrap(bytes);
	    long high = bb.getLong();
	    long low = bb.getLong();
	    return new UUID(high, low);
	}
	

}