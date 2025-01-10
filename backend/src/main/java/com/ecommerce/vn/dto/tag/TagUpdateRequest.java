package com.ecommerce.vn.dto.tag;

import java.util.UUID;

public class TagUpdateRequest {
	
	private UUID id;
	
	private String tagName;
	
	private Boolean active;
	
	

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getTagName() {
		return tagName;
	}

	public void setTagName(String tagName) {
		this.tagName = tagName;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}
	
	
}
