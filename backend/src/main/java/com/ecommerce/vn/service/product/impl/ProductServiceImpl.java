package com.ecommerce.vn.service.product.impl;

import java.math.BigDecimal;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.vn.dto.product.ProductWithScore;
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
		productRepository.delete(product);
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
				case "rating-asc":
					// If you have a rating field or calculated average in the Product entity
					pageSort = Sort.by(Sort.Direction.ASC, "ratings.value"); 
					break;
				case "rating-desc":
					pageSort = Sort.by(Sort.Direction.DESC, "ratings.value");
					break;
				case "price-asc":
					// Assuming you want to sort by the minimum price of variants
					pageSort = Sort.by(Sort.Direction.ASC, "variants.price");
					break;
				case "price-desc":
					pageSort = Sort.by(Sort.Direction.DESC, "variants.price");
					break;
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
	public List<Product> getFeatureProduct() {
		// TODO Auto-generated method stub
		return null;
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
	public List<ProductWithScore> getRelatedProducts(UUID productId) {	
		if(isProductExist(productId)) {
			List<ProductWithScore> relatedProducts = productRepository.findRelatedProducts(productId);			
			return relatedProducts;
		}
		
		return List.of();
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

}