package com.ecommerce.vn.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.entity.attribute.AttributeValue;
import com.ecommerce.vn.entity.product.Variant;

@Repository
public interface VariantRepository extends JpaRepository<Variant, UUID>{
	
	@Query("SELECT v FROM Variant v WHERE v.price BETWEEN :minPrice AND :maxPrice")
	List<Variant> findAllByPriceBetween(@Param("minPrice") BigDecimal minPrice,@Param("maxPrice") BigDecimal maxPrice);
	
	@Query("SELECT v FROM Variant v WHERE "
			+ "(v.discountPrice IS NOT NULL AND v.discountPrice BETWEEN :minPrice AND :maxPrice) OR "
			+ "(v.discountPrice IS NULL AND v.price BETWEEN :minPrice AND :maxPrice)")
	List<Variant> findAllByDiscountPriceBetween(@Param("minPrice") BigDecimal minPrice,@Param("maxPrice") BigDecimal maxPrice);
	
	@Query("SELECT v FROM Variant v JOIN v.attributeValues av WHERE av IN :attributeValues GROUP BY v HAVING COUNT(DISTINCT av) = :attributeSize")
	List<Variant> findByAttributeValues(@Param("attributeValues") Set<AttributeValue> attributeValues, @Param("attributeSize") long attributeSize);
	
	@Query("SELECT v.quantity FROM Variant v WHERE v.id = :variantId")
	Integer findVariantQuantity(@Param("variantId") UUID variantId);
	
	@Query("SELECT v FROM Variant v WHERE v.product.id = :productId")
	Page<Variant> findByProductId(@Param("productId") UUID productId ,  Pageable pageable);
	
	@Modifying
	@Query("UPDATE Variant v SET v.quantity = v.quantity - :quantity WHERE v.id = :variantId AND v.quantity >= :quantity")
	Integer decreaseStock(@Param("variantId") UUID variantId, @Param("quantity") int quantity);
	
	@Query("SELECT COUNT(v) > 0 FROM Variant v WHERE v.id = :variantId AND v.product.id = :productId")
	boolean isVariantOfProduct(@Param("variantId") UUID variantId, @Param("productId") UUID productId);


}
