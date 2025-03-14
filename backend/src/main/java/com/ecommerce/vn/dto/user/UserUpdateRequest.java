package com.ecommerce.vn.dto.user;

import java.util.UUID;

public class UserUpdateRequest {
	private UUID id;
	private String email;
	
	private String firstname;
	
	private String lastname;
	
	private String username;
	
	private String phone;
	
	private String dateOfBirth;
	
	private String gender;
	
	
	
	

	
	
	@Override
	public String toString() {
		return "UserUpdateRequest [id=" + id + ", email=" + email + ", firstname=" + firstname + ", lastname="
				+ lastname + ", username=" + username + ", phone=" + phone + ", dateOfBirth=" + dateOfBirth
				+ ", gender=" + gender + ", getPhone()=" + getPhone() + ", getDateOfBirth()=" + getDateOfBirth()
				+ ", getGender()=" + getGender() + ", getUsername()=" + getUsername() + ", getId()=" + getId()
				+ ", getEmail()=" + getEmail() + ", getFirstname()=" + getFirstname() + ", getLastname()="
				+ getLastname() + ", getClass()=" + getClass() + ", hashCode()=" + hashCode() + ", toString()="
				+ super.toString() + "]";
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(String dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
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

	
}
