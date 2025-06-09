package com.ecommerce.vn.dto.message;

import java.util.UUID;

public class MessageImageResponse {
    private UUID id;
    private String imageUrl; 
    private UUID messageId;
	public UUID getId() {
		return id;
	}
	public void setId(UUID id) {
		this.id = id;
	}
	public String getImageUrl() {
		return imageUrl;
	}
	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
	public UUID getMessageId() {
		return messageId;
	}
	public void setMessageId(UUID messageId) {
		this.messageId = messageId;
	}
    
    
}
