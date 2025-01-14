package com.ecommerce.vn.service.convert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.role.RoleCreateRequest;
import com.ecommerce.vn.dto.role.RoleResponse;
import com.ecommerce.vn.dto.role.RoleUpdateRequest;
import com.ecommerce.vn.entity.role.Role;
import com.ecommerce.vn.service.role.RoleService;

@Service
public class RoleConvert {
	
	@Autowired
	private RoleService roleService;

	public Role roleCreateConvertToRole(RoleCreateRequest roleCreateRequest) {
		if(roleCreateRequest == null) {
			return null;
		}
		
		Role role = new Role();
		role.setRoleName(roleCreateRequest.getName());
		return role;
	}
	
	public Role roleUpdateConvertToRole(RoleUpdateRequest roleUpdateRequest) {
		if(roleUpdateRequest == null) {
			return null;
		}
		Role role = roleService.getRoleById(roleUpdateRequest.getId());
		role.setRoleName(roleUpdateRequest.getName());	
		return role;
	}
	
	public RoleResponse roleConvertToRoleResponse(Role role) {
		if(role == null) {
			return null;
		}
		
		RoleResponse roleResponse = new RoleResponse();
		roleResponse.setRoleName(role.getRoleName());
		roleResponse.setId(role.getId());
		
		return roleResponse;
	}
	
}
