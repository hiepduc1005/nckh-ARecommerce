package com.ecommerce.vn.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.entity.product.ItemType;
import com.ecommerce.vn.entity.product.ModelCustomize;

@Repository
public interface ModelCustomizeRepository extends JpaRepository<ModelCustomize, UUID>{

	@Query("SELECT m FROM ModelCustomize m WHERE m.itemType = :type")
	Page<ModelCustomize> getModelByType(@Param("type") ItemType type, Pageable pageable);
}
