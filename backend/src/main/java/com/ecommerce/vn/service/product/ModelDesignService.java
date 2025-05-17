package com.ecommerce.vn.service.product;

import java.util.UUID;

import org.springframework.data.domain.Page;

import com.ecommerce.vn.entity.product.ModelDesign;

public interface ModelDesignService{

	ModelDesign createModelDesign(ModelDesign modelDesign);
	ModelDesign updateModeldeDesign(ModelDesign modelDesign);
	ModelDesign getModelDesignById(UUID id);
	Page<ModelDesign>  getModelDesignBySessionId(String sessionId, int page, int size);
	void deleteModelDesign (UUID modelDesignId);
	
	ModelDesign cloneModel(UUID modelDesignId, String sessionId);
}
