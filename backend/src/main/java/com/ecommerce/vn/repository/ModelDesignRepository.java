package com.ecommerce.vn.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.entity.product.ModelDesign;

@Repository
public interface ModelDesignRepository extends JpaRepository<ModelDesign, UUID>{

	@Query("SELECT md FROM ModelDesign md WHERE md.sessionId = :sessionId ORDER BY md.createdAt")
	Page<ModelDesign> getModelDesignsBySessionId(@Param("sessionId") String sessionId, Pageable pageable);
}
