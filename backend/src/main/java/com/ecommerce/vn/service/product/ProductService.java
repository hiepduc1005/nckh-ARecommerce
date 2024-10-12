package com.ecommerce.vn.service.product;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.ecommerce.vn.entity.product.Product;

public interface ProductService {

    Product createProduct(Product product);

    Product updateProduct(UUID productId, Product productUpdate);

    Product findProductByUuid(UUID productId);

    void deleteProduct(UUID productId);

    List<Product> searchProducts(String keyword);

    // Lọc sản phẩm theo danh mục, giá, và các thuộc tính khác
    List<Product> filterProducts(UUID category, BigDecimal minPrice, BigDecimal maxPrice, String keyword);

    // Phân trang và sắp xếp sản phẩm
    Page<Product> getProductsWithPaginationAndSorting(int page, int size, String sortBy);

    Product getProductById(UUID productId);
    
    List<Product> getProductBySeller(UUID sellerId);
    
    List<Product> getAllProductUnactive();
    
    Product activateProduct(UUID productId);
    
    Product deactiveProduct(UUID productId);
    
    List<Product> getAllProducts();
    
//    San pham noi bat
    List<Product> getFeatureProduct();
    
    Boolean isProductExist(UUID productId);



    // // Sản phẩm yêu thích
    // List<Product> getWishlist(UUID userId);
    
    // void addToWishlist(UUID userId, UUID productId);
    
    // void removeFromWishlist(UUID userId, UUID productId);

    // Sản phẩm liên quan
     List<Product> getRelatedProducts(UUID productId);
}
