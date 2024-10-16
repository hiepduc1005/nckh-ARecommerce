package com.ecommerce.vn.dto.user;

import java.util.UUID;

public class UserAddressResponse {
	private UUID id;
	
	private String addressLine1;
	
	private String addressLine2;
	
	private String postalCode;
	
	private String country;
	
	private String city;

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getAddressLine1() {
		return addressLine1;
	}

	public void setAddressLine1(String addressLine1) {
		this.addressLine1 = addressLine1;
	}

	public String getAddressLine2() {
		return addressLine2;
	}

	public void setAddressLine2(String addressLine2) {
		this.addressLine2 = addressLine2;
	}

	public String getPostalCode() {
		return postalCode;
	}

	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public UserAddressResponse(UUID id, String addressLine1, String addressLine2, String postalCode, String country,
			String city) {
		this.id = id;
		this.addressLine1 = addressLine1;
		this.addressLine2 = addressLine2;
		this.postalCode = postalCode;
		this.country = country;
		this.city = city;
	} 
	
	
}
