package com.ecommerce.vn.service.convert;

import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.model.ModelCustomizeCreateRequest;
import com.ecommerce.vn.dto.model.ModelCustomizeResponse;
import com.ecommerce.vn.entity.product.ModelCustomize;

@Service
public class ModelCustomizeConvert {

	public ModelCustomize convertCreateRequest(ModelCustomizeCreateRequest createRequest) {
		ModelCustomize customize = new ModelCustomize();
		customize.setItemType(createRequest.getItemType());
		customize.setPrice(createRequest.getPrice());
		customize.setName(createRequest.getName());
		
		return customize;
	}
	
	public ModelCustomizeResponse convertToResponse(ModelCustomize modelCustomize) {
		ModelCustomizeResponse customizeResponse = new ModelCustomizeResponse();
		customizeResponse.setId(modelCustomize.getId());
		customizeResponse.setImagePath(modelCustomize.getImagePath());
		customizeResponse.setItemType(modelCustomize.getItemType());
		customizeResponse.setModelPath(modelCustomize.getModelPath());
		customizeResponse.setName(modelCustomize.getName());
		customizeResponse.setPrice(modelCustomize.getPrice());
		customizeResponse.setCreatedAt(modelCustomize.getCreatedAt());
		
		return customizeResponse;
	}
}
