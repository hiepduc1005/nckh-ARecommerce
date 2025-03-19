package com.ecommerce.vn.dto.attribute;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AtributeUpdateRequest {
	private UUID id;
	
	private String name;
	
	@JsonProperty("active")
	private Boolean active;

	

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	
}
