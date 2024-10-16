package com.ecommerce.vn.service.product.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.exception.ResourceNotFoundException;
import com.ecommerce.vn.repository.ProductRepository;
import com.ecommerce.vn.service.product.ProductService;


public class ProductServiceImpl implements ProductService{

	@Autowired
	private  ProductRepository productRepository;

    @Override
    public Product createProduct(Product product) {
        if(findProductByUuid(product.getId()) != null ){
            throw new ResourceNotFoundException("Product", "productId", product.getId());
        }
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(UUID productId, Product productUpdate) {
        try {
			findProductByUuid(productUpdate.getId());
			
			return productRepository.save(productUpdate);
		}catch (Exception e) {
			throw new ResourceNotFoundException("Product", "productId", productUpdate.getId());
		}
    }

    @Override
    public void deleteProduct(UUID productId) {
      try {
        findProductByUuid(productId);

        productRepository.deleteById(productId);
      }catch(Exception e){
            throw new ResourceNotFoundException("Product", "productId", productId);
      }
    }

    @Override
	@Transactional(readOnly = true)
    public List<Product> searchProducts(String keyword) {
        return productRepository.findByKeywordProducts(keyword); 
    }

    @Override
	@Transactional(readOnly = true)
    public Page<Product> getProductsWithPaginationAndSorting(int page, int size, String sortBy) {
       Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
    
       return productRepository.findAll(pageable);
    }

    @Override
    public Product getProductById(UUID productId) {
        return productRepository.findById(productId)
        .orElseThrow( () -> new ResourceNotFoundException("Product", "productId", productId));
    }


    @Override
	@Transactional(readOnly = true)
    public Product findProductByUuid(UUID productId) {
        return productRepository.findById(productId)
        .orElseThrow( () -> new ResourceNotFoundException("Product", "productId", productId));
    }

    @Override
	@Transactional(readOnly = true)
    public List<Product> filterProducts(UUID category, BigDecimal minPrice, BigDecimal maxPrice, String keyword) {
       return productRepository.filterProducts(category, minPrice, maxPrice, keyword);
    }

	@Override
	@Transactional(readOnly = true)
	public List<Product> getProductBySeller(UUID sellerId) {
		if(sellerId == null) {
			throw new RuntimeException("Seller id must not be null");
		}
		
		return productRepository.findBySellerId(sellerId);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Product> getAllProductUnactive() {
		return productRepository.findProductsUnactive();
	}

	@Override
	@Transactional
	public Product activateProduct(UUID productId) {
		Product product = findProductByUuid(productId);
		
		product.setActive(true);
		
		return productRepository.save(product);
	}

	@Override
	@Transactional
	public Product deactiveProduct(UUID productId) {
		Product product = findProductByUuid(productId);
		
		product.setActive(false);
		
		return productRepository.save(product);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Product> getAllProducts() {
		return productRepository.findAll();
	}

	@Override
	public List<Product> getFeatureProduct() {
		
		return null;
	}

	@Override
	public Boolean isProductExist(UUID productId) {
		try {
			return productRepository.existsById(productId);
		} catch (Exception e) {
			return false;
		}
	}

	@Override
	public List<Product> getRelatedProducts(UUID productId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Product updateProductImage(UUID productId, MultipartFile image) {
	 
	try {
        Product product = findProductByUuid(productId);
        
        if (image != null && !image.isEmpty()) {

            String uploadDir = "/path/to/images/";
            String imageName = image.getOriginalFilename();
            Path path = Paths.get(uploadDir + imageName);
            Files.write(path, image.getBytes()); 

            product.setImagePath(path.toString());
        } else {
            throw new IllegalArgumentException("Image file is invalid or empty.");
        }

        return productRepository.save(product);
    } catch (IOException e) {
        throw new RuntimeException("Failed to store image", e);
    } catch (ResourceNotFoundException e) {
        throw new ResourceNotFoundException("Product", "productId", productId);
    }
}
}
