package com.ecommerce.vn.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.vn.dto.model.ModelDesignCreateRequest;
import com.ecommerce.vn.dto.model.ModelDesignResponse;
import com.ecommerce.vn.entity.product.ModelDesign;
import com.ecommerce.vn.service.convert.ModelDesignConvert;
import com.ecommerce.vn.service.product.ModelDesignService;


@RestController
@RequestMapping("api/v1/model-design")
public class ModelDesignController {

	@Autowired
	private ModelDesignService modelDesignService;
	
	@Autowired
	private ModelDesignConvert modelDesignConvert;
	
	@PostMapping
	public ResponseEntity<ModelDesignResponse> createModelDesign(@RequestBody ModelDesignCreateRequest createRequest){
		ModelDesign modelDesign = modelDesignConvert.modelDesignCreateRequestConvert(createRequest);
		modelDesign = modelDesignService.createModelDesign(modelDesign);
		
        ModelDesignResponse response = modelDesignConvert.modelConvertToResponse(modelDesign);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
 
	}
	
	@GetMapping("/{modelId}")
	public ResponseEntity<ModelDesignResponse> getModelDesignById(@PathVariable("modelId") UUID modelId){
		ModelDesign modelDesign = modelDesignService.getModelDesignById(modelId);
        ModelDesignResponse response = modelDesignConvert.modelConvertToResponse(modelDesign);

        return ResponseEntity.status(HttpStatus.OK).body(response);
	}
	
	@GetMapping
	public ResponseEntity<Page<ModelDesignResponse>> getModelDesignBySessionId(
			@RequestParam(name = "sessionId",required = true) String sessionId,
			@RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "8", required = false) int size
			){
		
		Page<ModelDesign> modelDesigns = modelDesignService.getModelDesignBySessionId(sessionId, page, size);
	
    	Page<ModelDesignResponse> modelDesignResponses = modelDesigns.map(model -> modelDesignConvert.modelConvertToResponse(model));


        return ResponseEntity.ok(modelDesignResponses);

	}
	
	
	@DeleteMapping("/{modelId}")
	public ResponseEntity<?> deleteModelDesignById(@PathVariable("modelId") UUID modelId){
		modelDesignService.deleteModelDesign(modelId);

        return ResponseEntity.status(HttpStatus.OK).body("Xoa design thanh cong!");
	}
	
	
	
}
