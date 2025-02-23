package com.ecommerce.vn.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.entity.product.Tag;

@Repository
public interface TagRepository extends JpaRepository<Tag, UUID> {
	 boolean existsByTagName(String tagName);
	 
	 @Query("SELECT t FROM Tag t WHERE LOWER(t.tagName) LIKE LOWER(CONCAT('%', :name, '%'))")
	 List<Tag> findByName(@Param("name") String name);

	 @Query("SELECT t FROM Tag t WHERE t.active = true")
	 List<Tag> getActiveTag();
	 
	 @Query("SELECT t FROM Tag t WHERE t.active = false")
	 List<Tag> getUnactiveTag();
}