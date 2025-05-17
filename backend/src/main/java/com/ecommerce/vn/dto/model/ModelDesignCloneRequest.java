package com.ecommerce.vn.dto.model;

import java.util.UUID;

public class ModelDesignCloneRequest {

	private UUID id;
	
	private String sessionId;
	
	

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}
	
	
}
