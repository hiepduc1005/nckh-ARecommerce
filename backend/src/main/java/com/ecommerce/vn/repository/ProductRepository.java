package com.ecommerce.vn.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.dto.product.ProductWithScore;
import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.product.Tag;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>{

    @Query(value = "SELECT * FROM product p WHERE p.product_name ILIKE %:keyword% OR p.description ILIKE %:keyword% OR p.short_description ILIKE %:keyword%", nativeQuery = true)
    List<Product> findByKeywordProducts(@Param("keyword") String keyword);

//    @Query("SELECT p FROM Product p WHERE (:category IS NULL OR p.category = :category) AND (:minPrice IS NULL OR p.price >= :minPrice) AND (:maxPrice IS NULL OR p.price <= :maxPrice) AND (p.name LIKE %:keyword% OR p.description LIKE %:keyword% OR p.shortDescription LIKE %:keyword%)")
//    List<Product> filterProducts(@Param("category") UUID category, 
//	                             @Param("minPrice") BigDecimal minPrice, 
//	                             @Param("maxPrice") BigDecimal maxPrice, 
//	                             @Param("keyword") String keyword);
    

    @Query("SELECT p FROM Product p WHERE p.active = false")
    List<Product> findProductsUnactive();
    
    @Query("SELECT p FROM Product p WHERE p.active = true")
    List<Product> findProductsActive();
    
    @EntityGraph(attributePaths = "categories")
    Page<Product> findAll(Pageable pageable);
    
    @Query("SELECT DISTINCT p FROM Product p "
            + "LEFT JOIN p.categories c "
            + "LEFT JOIN p.variants v "
            + "LEFT JOIN p.brand b "
            + "WHERE (:categories IS NULL OR c.categoryName IN :categories) "
            + "AND ( :minPrice IS NULL OR (v.discountPrice IS NOT NULL AND v.discountPrice > 0 AND v.discountPrice >= :minPrice) OR v.price >= :minPrice) "
            + "AND ( :maxPrice IS NULL OR (v.discountPrice IS NOT NULL AND v.discountPrice > 0 AND v.discountPrice <= :maxPrice) OR v.price <= :maxPrice) "
            + "AND (:brands IS NULL OR b.name IN :brands) "
            + "AND (:keyword IS NULL OR p.productName LIKE CONCAT('%', :keyword, '%')) "
            + "ORDER BY p.createdAt DESC")
    Page<Product> filterProducts(
            @Param("categories") List<String> categories,
            @Param("brands") List<String> brands,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    
    @Query(value = "SELECT p.id AS id, " +
            "       p.active AS active, " +
            "       p.product_name AS productName, " +
            "       p.description AS description, " +
            "       p.image_path AS imagePath, " +
            "       p.short_description AS shortDescription, " +
            "       p.sold_quantity AS soldQuantity, " +
            "       (COUNT(DISTINCT c.id) + COUNT(DISTINCT t.id)) * 0.7 + p.sold_quantity * 0.3 AS score, " +
            "       p.created_at AS createdAt, " +
            "       p.update_at AS updateAt, " +
            "       p.created_by AS createdBy, " +
            "       p.updated_by AS updatedBy " +
            "FROM product p " +
            "LEFT JOIN products_categories c ON c.product_id = p.id " +
            "LEFT JOIN products_tags t ON t.product_id = p.id " +
            "WHERE p.id != :productId " +
            "GROUP BY p.id " +
            "ORDER BY score DESC " +
            "LIMIT 10;",
            nativeQuery = true)
    List<ProductWithScore> findRelatedProducts(@Param("productId") UUID productId);

    @Query("SELECT p FROM Product p JOIN p.tags t WHERE t = :tag")
    List<Product> findByTag(@Param("tag") Tag tag);
    
    @Query("SELECT p FROM Product p JOIN p.tags t WHERE t.tagName = :tagName")
    List<Product> findByTagName(@Param("tagName") String tagName);


    @Query("SELECT p FROM Product p JOIN p.categories t WHERE t.categoryName = :categoryName")
    List<Product> findByCategoryName(@Param("categoryName") String categoryName);
    
    @Query("SELECT p FROM Product p WHERE p.slug = :slug")
    Optional<Product> getProductBySlug(@Param("slug") String slug);

}
