package com.ecommerce.vn.service.convert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.model.ModelCustomizeCreateRequest;
import com.ecommerce.vn.dto.model.ModelCustomizeResponse;
import com.ecommerce.vn.dto.model.ModelCustomizeUpdateRequest;
import com.ecommerce.vn.entity.product.ModelCustomize;
import com.ecommerce.vn.service.product.ModelCustomizeService;

@Service
public class ModelCustomizeConvert {
	
	@Autowired
	private ModelCustomizeService customizeService;
	
	

	public ModelCustomize convertCreateRequest(ModelCustomizeCreateRequest createRequest) {
		ModelCustomize customize = new ModelCustomize();
		customize.setItemType(createRequest.getItemType());
		customize.setPrice(createRequest.getPrice());
		customize.setName(createRequest.getName());
		
		return customize;
	}
	
	public ModelCustomize convertUpdateRequest(ModelCustomizeUpdateRequest updateRequest) {
		ModelCustomize customize = customizeService.getModelById(updateRequest.getId());
		customize.setItemType(updateRequest.getItemType());
		customize.setPrice(updateRequest.getPrice());
		customize.setName(updateRequest.getName());
		customize.setId(updateRequest.getId());
		
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
