package com.ecommerce.vn.dto.model;

import java.util.UUID;

public class ModelDesignCreateRequest {

	private String sessionId;
	
	private UUID modelId;
	
	private String colorConfig;
	
	private String imagePath;
		

	public String getImagePath() {
		return imagePath;
	}

	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	public UUID getModelId() {
		return modelId;
	}

	public void setModelId(UUID modelId) {
		this.modelId = modelId;
	}

	public String getColorConfig() {
		return colorConfig;
	}

	public void setColorConfig(String colorConfig) {
		this.colorConfig = colorConfig;
	}
	
	
}
