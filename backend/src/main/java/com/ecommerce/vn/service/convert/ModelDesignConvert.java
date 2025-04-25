package com.ecommerce.vn.service.convert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.model.ModelCustomizeResponse;
import com.ecommerce.vn.dto.model.ModelDesignCreateRequest;
import com.ecommerce.vn.dto.model.ModelDesignResponse;
import com.ecommerce.vn.entity.product.ModelCustomize;
import com.ecommerce.vn.entity.product.ModelDesign;
import com.ecommerce.vn.service.product.ModelCustomizeService;

@Service
public class ModelDesignConvert {
	
	@Autowired
	private ModelCustomizeService modelCustomizeService;
	
	@Autowired
	private ModelCustomizeConvert modelCustomizeConvert;

	public ModelDesign modelDesignCreateRequestConvert(ModelDesignCreateRequest createRequest) {
		ModelCustomize model = modelCustomizeService.getModelById(createRequest.getModelId());
		
		ModelDesign modelDesign = new ModelDesign();
		modelDesign.setColorConfig(createRequest.getColorConfig());
		modelDesign.setSessionId(createRequest.getSessionId());
		modelDesign.setModel(model);
		
		return modelDesign;
	}
	
	public ModelDesignResponse modelConvertToResponse(ModelDesign modelDesign) {
		ModelDesignResponse response = new ModelDesignResponse();
		response.setColorConfig(modelDesign.getColorConfig());
		response.setId(modelDesign.getId());
		response.setCreatedAt(modelDesign.getCreatedAt());
		response.setSessionId(modelDesign.getSessionId());
		
		ModelCustomizeResponse customizeResponse = modelCustomizeConvert.convertToResponse(modelDesign.getModel());
		response.setModelCustomizeResponse(customizeResponse);
		
		return response;
	}
}
