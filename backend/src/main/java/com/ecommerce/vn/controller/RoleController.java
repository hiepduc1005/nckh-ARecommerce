package com.ecommerce.vn.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.vn.dto.role.RoleCreateRequest;
import com.ecommerce.vn.dto.role.RoleResponse;
import com.ecommerce.vn.dto.role.RoleUpdateRequest;
import com.ecommerce.vn.entity.role.Role;
import com.ecommerce.vn.service.convert.RoleConvert;
import com.ecommerce.vn.service.role.RoleService;


@RestController
@RequestMapping("api/v1/role")
public class RoleController {

	@Autowired
	private RoleService roleService;
	
	@Autowired
	private RoleConvert roleConvert;
	
	@PostMapping
	public ResponseEntity<RoleResponse> createRole(@RequestBody RoleCreateRequest roleCreateRequest){
		Role role = roleConvert.roleCreateConvertToRole(roleCreateRequest);
		role = roleService.createRole(role);
		
		RoleResponse roleResponse = roleConvert.roleConvertToRoleResponse(role);
		return ResponseEntity.ok(roleResponse);
	}
	
	@GetMapping("/{roleName}")
	public ResponseEntity<RoleResponse> getRoleByName(@PathVariable("roleName") String roleName){
		Role role = roleService.getRoleByName(roleName);
		RoleResponse roleResponse = roleConvert.roleConvertToRoleResponse(role);
		return ResponseEntity.ok(roleResponse);
	}
	
	@GetMapping
	public ResponseEntity<List<RoleResponse>> getAllRole(){
		List<Role> roles = roleService.getAllRoles();
		List<RoleResponse> roleResponses = roles.stream().map((role) -> roleConvert.roleConvertToRoleResponse(role)).toList();
		return ResponseEntity.ok(roleResponses);
	}
	
	@PutMapping
	public ResponseEntity<RoleResponse> updateRole(@RequestBody RoleUpdateRequest roleUpdateRequest){
		Role role = roleConvert.roleUpdateConvertToRole(roleUpdateRequest);
		role = roleService.updateRole(role);
		
		RoleResponse roleResponse = roleConvert.roleConvertToRoleResponse(role);
		return ResponseEntity.ok(roleResponse);
	}
	
	@DeleteMapping("/{roleId}")
	public ResponseEntity<?> deleteRole(@PathVariable("roleId") UUID roleId){
		roleService.deleteRole(roleId);
		
		return ResponseEntity.ok("Delete role success!");
	}
	
	
}
