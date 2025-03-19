package com.ecommerce.vn.dto.tag;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TagCreateRequest {
	
	private String tagName;
	
	@JsonProperty("active")	
	private Boolean active;
	
	

	@Override
	public String toString() {
		return "TagCreateRequest [tagName=" + tagName + ", active=" + active + "]";
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
