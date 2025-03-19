package com.ecommerce.vn.dto.attribute;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AttributeCreateRequest {
	private String name;
	
	@JsonProperty("active")
	private Boolean active;
	

	public Boolean getActive() {
		return active;
	}


	public void setActive(Boolean active) {
		this.active = active;
	}


	@Override
	public String toString() {
		return "AttributeCreateRequest [name=" + name + " ]";
	}


	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}

	
	
}
