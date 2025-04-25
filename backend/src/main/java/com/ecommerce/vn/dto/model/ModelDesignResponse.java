package com.ecommerce.vn.dto.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class ModelDesignResponse {

	private UUID id;
	private String sessionId;
	private ModelCustomizeResponse modelCustomizeResponse;
	private String colorConfig;
    private LocalDateTime createdAt;
	public UUID getId() {
		return id;
	}
	public void setId(UUID id) {
		this.id = id;
	}
	public String getSessionId() {
		return sessionId;
	}
	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}
	public ModelCustomizeResponse getModelCustomizeResponse() {
		return modelCustomizeResponse;
	}
	public void setModelCustomizeResponse(ModelCustomizeResponse modelCustomizeResponse) {
		this.modelCustomizeResponse = modelCustomizeResponse;
	}
	public String getColorConfig() {
		return colorConfig;
	}
	public void setColorConfig(String colorConfig) {
		this.colorConfig = colorConfig;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

    
    
}
