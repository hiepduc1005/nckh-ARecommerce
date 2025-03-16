package com.ecommerce.vn.dto.user;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty; 

public class UserAddressCreateRequest {
	private UUID userId;
	
	private String name;
	
	private String phone;
	
	private String address;
	
	private String district;
	
	@JsonProperty("isDefault")
	private Boolean isDefault;
	
	

	@Override
	public String toString() {
		return "UserAddressCreateRequest [userId=" + userId + ", name=" + name + ", phone=" + phone + ", address="
				+ address + ", district=" + district + ", isDefault=" + isDefault + "]";
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

	public String getDistrict() {
		return district;
	}

	public void setDistrict(String district) {
		this.district = district;
	}

	public Boolean isDefault() {
		return isDefault;
	}

	public void setDefault(Boolean isDefault) {
		this.isDefault = isDefault;
	}

	
	
	
}
