package com.ecommerce.vn.dto.user;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.ecommerce.vn.dto.role.RoleResponse;
import com.ecommerce.vn.entity.role.Role;

public class UserResponse {
	
	private UUID id;

	private String firstname;
	
	private String lastname;
	
	private String userName;
	
	private String email;
	
	private String phoneNumber;
	
	private String gender; 
	
	private String dateOfBirth;

	private boolean active;
	
	private Integer loyaltyPoint;
	
	private Set<UserAddressResponse> addressResponses = new HashSet<UserAddressResponse>();
	
	private List<RoleResponse> roles = new ArrayList<>();
	
	private LocalDateTime createdAt;
	
	private LocalDateTime deletedAt;

	

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
	
	

	public UserResponse() {
	}



	public UserResponse(UUID id, String firstname, String lastname, String userName, String email, String phoneNumber,
			boolean active, Integer loyaltyPoint, Set<UserAddressResponse> addressResponses, LocalDateTime createdAt,
			LocalDateTime deletedAt) {
		this.id = id;
		this.firstname = firstname;
		this.lastname = lastname;
		this.userName = userName;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.active = active;
		this.loyaltyPoint = loyaltyPoint;
		this.addressResponses = addressResponses;
		this.createdAt = createdAt;
		this.deletedAt = deletedAt;
	}
	
	

    

	



	public List<RoleResponse> getRoles() {
		return roles;
	}



	public void setRoles(List<RoleResponse> roles) {
		this.roles = roles;
	}



	public String getGender() {
		return gender;
	}



	public void setGender(String gender) {
		this.gender = gender;
	}



	public String getDateOfBirth() {
		return dateOfBirth;
	}



	public void setDateOfBirth(String dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}



	public String getUserName() {
		return userName;
	}



	public void setUserName(String userName) {
		this.userName = userName;
	}



	public boolean isActive() {
		return active;
	}



	public void setActive(boolean active) {
		this.active = active;
	}



	public Integer getLoyaltyPoint() {
		return loyaltyPoint;
	}



	public void setLoyaltyPoint(Integer loyaltyPoint) {
		this.loyaltyPoint = loyaltyPoint;
	}



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
	
	
}
