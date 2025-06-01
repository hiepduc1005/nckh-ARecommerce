package com.ecommerce.vn.scheduler;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.service.product.ProductService;

@Component
public class ProductTask {
	
	@Autowired
    private ProductService productService;
	
	@Scheduled(fixedRate = 1800000) 
    public void updateFeatureProduct() {
    	List<Product> products = productService.getAllProducts();
    	productService.updateProductFeatured(products);
    }
}
