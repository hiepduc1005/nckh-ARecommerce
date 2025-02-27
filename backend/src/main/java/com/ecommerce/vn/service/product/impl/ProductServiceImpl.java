package com.ecommerce.vn.service.product.impl;

import java.math.BigDecimal;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.vn.dto.product.ProductWithScore;
import com.ecommerce.vn.entity.attribute.Attribute;
import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.product.Tag;
import com.ecommerce.vn.repository.ProductRepository;
import com.ecommerce.vn.service.attribute.AttributeService;
import com.ecommerce.vn.service.attribute.impl.AttributeServiceImpl;
import com.ecommerce.vn.service.product.ProductService;

@Service
@Transactional
public class ProductServiceImpl implements ProductService{
	
	@Autowired
	private ProductRepository productRepository;
	
	@Autowired
	private AttributeService attributeService;

	
	@Override
	public Product createProduct(Product product) {
		product.setActive(false);
		
		List<Attribute> attributes = product.getAttributes()
			.stream()
			.map(
					(attribute) -> attributeService.createAttributeIfExist(attribute.getAttributeName())
				)
			.toList();
		
		product.setAttributes(attributes);
		
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
	public List<Product> searchProducts(String keyword) {
		return productRepository.findByKeywordProducts(keyword);
	}

	@Override
	public Product updateProductImage(UUID productId, MultipartFile image) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Product> filterProducts(UUID category, BigDecimal minPrice, BigDecimal maxPrice, String keyword) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Page<Product> getProductsWithPaginationAndSorting(int page, int size, String sortBy) {
		// TODO Auto-generated method stub
		return null;
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
}