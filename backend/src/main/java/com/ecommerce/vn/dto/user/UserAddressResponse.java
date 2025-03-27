package com.ecommerce.vn.dto.user;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserAddressResponse {
	private UUID id;
	
	private UUID userId;
	
	private String name;
	
	private String phone;
	
	private String address;
	
	private String specificAddress;
	
	@JsonProperty("isDefault")
	private boolean isDefault;

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public UUID getUserId() {
		return userId;
	}

	public void setUserId(UUID userId) {
		this.userId = userId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	

	public String getSpecificAddress() {
		return specificAddress;
	}

	public void setSpecificAddress(String specificAddress) {
		this.specificAddress = specificAddress;
	}

	public boolean isDefault() {
		return isDefault;
	}

	public void setDefault(boolean isDefault) {
		this.isDefault = isDefault;
	}

	
	
}
