package com.ecommerce.vn.dto.tag;

public class TagUpdateRequest {
	
	private String tagName;
	
	private Boolean active;

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
