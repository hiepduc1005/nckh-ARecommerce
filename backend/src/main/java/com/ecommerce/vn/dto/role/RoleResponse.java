package com.ecommerce.vn.dto.role;

import java.util.UUID;

public class RoleResponse {

	private UUID id;
	
	private String roleName;

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}
	
	
}
