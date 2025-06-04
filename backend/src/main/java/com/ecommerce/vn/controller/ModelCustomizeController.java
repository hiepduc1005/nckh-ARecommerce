package com.ecommerce.vn.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.vn.dto.model.ModelCustomizeCreateRequest;
import com.ecommerce.vn.dto.model.ModelCustomizeResponse;
import com.ecommerce.vn.dto.model.ModelCustomizeUpdateRequest;
import com.ecommerce.vn.entity.product.ItemType;
import com.ecommerce.vn.entity.product.ModelCustomize;
import com.ecommerce.vn.exception.ResourceNotFoundException;
import com.ecommerce.vn.service.FileUploadService;
import com.ecommerce.vn.service.convert.ModelCustomizeConvert;
import com.ecommerce.vn.service.product.ModelCustomizeService;

@RestController
@RequestMapping("api/v1/model-customize")
public class ModelCustomizeController {

	@Autowired
	private ModelCustomizeService modelCustomizeService;
	
	@Autowired
	private ModelCustomizeConvert modelCustomizeConvert;
	
    @Autowired
    private FileUploadService fileUploadService;
	
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
	public ResponseEntity<?> createModelCustomize(
			@RequestPart("customize") ModelCustomizeCreateRequest createRequest,
			@RequestPart("model") MultipartFile model,
			@RequestPart("image") MultipartFile image){
		
    	if(image == null) {
    		return ResponseEntity.badRequest().body("Product image is empty!");
    	}
    	
    	if(model == null) {
    		return ResponseEntity.badRequest().body("Model is empty!");
    	}
    	
    	ModelCustomize modelCustomize = modelCustomizeConvert.convertCreateRequest(createRequest);
        String imagePath = fileUploadService.uploadFileToServer(image);
        modelCustomize.setImagePath(imagePath);
        
        String modelPath = fileUploadService.uploadModelToServer(model);
        modelCustomize.setModelPath(modelPath);
        
        modelCustomize = modelCustomizeService.createModel(modelCustomize);
        
        ModelCustomizeResponse response = modelCustomizeConvert.convertToResponse(modelCustomize);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PutMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
	public ResponseEntity<?> updateModelCustomize(
			@RequestPart("customize") ModelCustomizeUpdateRequest updateRequest,
			@RequestPart(name ="model",required = false) MultipartFile model,
			@RequestPart(name ="image",required = false) MultipartFile image){
		
    	ModelCustomize modelCustomize = modelCustomizeConvert.convertUpdateRequest(updateRequest);
    	if(image != null) {
    		
    		String imagePath = fileUploadService.uploadFileToServer(image);
    		modelCustomize.setImagePath(imagePath);
    		
    	}
    	
    	if(model != null) {
    		String modelPath = fileUploadService.uploadModelToServer(model);
    		modelCustomize.setModelPath(modelPath);
    		
    	}
        modelCustomize = modelCustomizeService.updateModel(modelCustomize);
        
        ModelCustomizeResponse response = modelCustomizeConvert.convertToResponse(modelCustomize);
        
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
    @GetMapping
    public ResponseEntity<Page<ModelCustomizeResponse>> getModelByType(
            @RequestParam("page") int page,
            @RequestParam("size") int size,
            @RequestParam(value ="type" , required = false, defaultValue = "") String type) {
    	
    	Page<ModelCustomize> models;
    	if(type.isEmpty()) {
    		models = modelCustomizeService.getModelsPagiante(page, size);
    	}else {
    		 models = modelCustomizeService.getModelByType(ItemType.valueOf(type),page, size);
    	}
    	
        
    	Page<ModelCustomizeResponse> modelsResponse = models.map(model -> modelCustomizeConvert.convertToResponse(model));
    	return new ResponseEntity<>(modelsResponse, HttpStatus.OK);
    }
    
    
    
    @GetMapping("/{modelId}")
    public ResponseEntity<ModelCustomizeResponse> findModelCustomieById(@PathVariable("modelId") UUID modelId){
        ModelCustomize modelCustomize = modelCustomizeService.getModelById(modelId);
        if (modelCustomize == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); 
        }

        ModelCustomizeResponse response = modelCustomizeConvert.convertToResponse(modelCustomize);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{modelId}")
   	public ResponseEntity<String> deleteModel(@PathVariable("modelId") UUID modelId){
   		try {
               modelCustomizeService.deleteModel(modelId);
               return ResponseEntity.ok("Model customize deleted successfully.");
           } catch (ResourceNotFoundException e) {
               return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found.");
           } catch (Exception e) {
               return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the Product.");
           }
   	}

    
	
}
