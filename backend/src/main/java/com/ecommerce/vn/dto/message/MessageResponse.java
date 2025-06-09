package com.ecommerce.vn.dto.message;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.ecommerce.vn.entity.message.MessageRole;

public class MessageResponse {

	private UUID id;
	private MessageRole role;
	private UUID userId;
	private String content;
	private List<MessageImageResponse> messageImages;
	private LocalDateTime timestamp;
	
	
	public List<MessageImageResponse> getMessageImages() {
		return messageImages;
	}
	public void setMessageImages(List<MessageImageResponse> messageImages) {
		this.messageImages = messageImages;
	}
	public UUID getId() {
		return id;
	}
	public void setId(UUID id) {
		this.id = id;
	}
	public MessageRole getRole() {
		return role;
	}
	public void setRole(MessageRole role) {
		this.role = role;
	}
	public UUID getUserId() {
		return userId;
	}
	public void setUserId(UUID userId) {
		this.userId = userId;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public LocalDateTime getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}
	
	
}
