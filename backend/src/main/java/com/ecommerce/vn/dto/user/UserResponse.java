package com.ecommerce.vn.dto.user;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;


public class UserResponse {
	
	private UUID id;
	
	private String firstname;
	
	private String lastname;
	
	private String email;
	
	private String phoneNumber;
	
	private Set<UserAddressResponse> addressResponses = new HashSet<UserAddressResponse>();

	private LocalDateTime createdAt;
	
	private LocalDateTime deletedAt;

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getFirstname() {
		return firstname;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public Set<UserAddressResponse> getAddressResponses() {
		return addressResponses;
	}

	public void setAddressResponses(Set<UserAddressResponse> addressResponses) {
		this.addressResponses = addressResponses;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getDeletedAt() {
		return deletedAt;
	}

	public void setDeletedAt(LocalDateTime deletedAt) {
		this.deletedAt = deletedAt;
	}

	public UserResponse(UUID id, String firstname, String lastname, String email, String phoneNumber,
			Set<UserAddressResponse> addressResponses, LocalDateTime createdAt, LocalDateTime deletedAt) {
		this.id = id;
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.addressResponses = addressResponses;
		this.createdAt = createdAt;
		this.deletedAt = deletedAt;
	}
}
