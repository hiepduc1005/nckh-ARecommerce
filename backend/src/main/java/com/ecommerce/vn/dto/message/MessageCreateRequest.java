package com.ecommerce.vn.dto.message;

import java.util.UUID;

import com.ecommerce.vn.entity.message.MessageRole;

public class MessageCreateRequest {

	private MessageRole role;
	private UUID userId;
	private String content;
	
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
	
	
	
}
