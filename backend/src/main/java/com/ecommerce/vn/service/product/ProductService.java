package com.ecommerce.vn.service.product;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.vn.dto.product.ProductWithScore;
import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.product.Tag;

public interface ProductService {

    Product createProduct(Product product);

    Product updateProduct(Product productUpdate);

    Product findProductByUuid(UUID productId);

    void deleteProduct(UUID productId);

    List<Product> searchProducts(String keyword);

    Product updateProductImage(UUID productId, MultipartFile image);

    // Lọc sản phẩm theo danh mục, giá, và các thuộc tính khác
    Page<Product> filterProducts(List<String> categories, List<String> brands, BigDecimal minPrice, BigDecimal maxPrice, String keyword, int page, int size);

    // Phân trang và sắp xếp sản phẩm
    Page<Product> getProductsWithPaginationAndSorting(int page, int size, String sortBy);

    Product getProductById(UUID productId);
    
    List<Product> getProductBySeller(UUID sellerId);
    
    List<Product> getAllProductUnactive();
    
    Product activateProduct(UUID productId);
    
    Product deactiveProduct(UUID productId);
    
    List<Product> getAllProducts();
    
    List<Product> getProductByTag(Tag tag);
    
//    San pham noi bat
    List<Product> getFeatureProduct();
    
    Boolean isProductExist(UUID productId);



    // // Sản phẩm yêu thích
    // List<Product> getWishlist(UUID userId);
    
    // void addToWishlist(UUID userId, UUID productId);
    
    // void removeFromWishlist(UUID userId, UUID productId);

    // Sản phẩm liên quan
     List<ProductWithScore> getRelatedProducts(UUID productId);
     
     Product getProductBySlug(String slug);
}
