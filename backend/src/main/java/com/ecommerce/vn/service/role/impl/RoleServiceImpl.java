package com.ecommerce.vn.service.role.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.vn.entity.role.Role;
import com.ecommerce.vn.repository.RoleRepository;
import com.ecommerce.vn.service.role.RoleService;

@Service
@Transactional
public class RoleServiceImpl implements RoleService {
	
	@Autowired
	private RoleRepository roleRepository;
	
	private static final String ADMIN_ROLE= "ADMIN";
	private static final String MODERATOR_ROLE= "MODERATOR";
	private static final String SUPPORT_ROLE= "SUPPORT";
	private static final String USER_ROLE= "USER";


	@Override
	public Role createRole(Role role) {
		// TODO Auto-generated method stub
		return roleRepository.save(role);
	}

	@Override
	public Role updateRole(Role roleDetails) {
		if(roleDetails.getId() == null) {
			throw new RuntimeException("Role id missing");
		}
		
		return roleRepository.save(roleDetails);
	}

	@Override
	public void deleteRole(UUID id) {
		Role role = getRoleById(id);
		roleRepository.delete(role);
	}

	@Override
	public Role getRoleById(UUID id) {
		if(id == null) {
			throw new RuntimeException("Role id missing");
		}
		return roleRepository.findById(id).orElseThrow(() -> 
				new RuntimeException("Cant not found role with id:" + id));
	}

	@Override
	public List<Role> getAllRoles() {
		
		return roleRepository.findAll();
	}

	@Override
	public Role createCustomerRole() {
		Role role = new Role();
		role.setRoleName(USER_ROLE);
		return createRole(role);
	}

	@Override
	public Role createModeratorRole() {
		Role role = new Role();
		role.setRoleName(MODERATOR_ROLE);
		return createRole(role);
	}

	@Override
	public Role createSupportRole() {
		Role role = new Role();
		role.setRoleName(SUPPORT_ROLE);
		return createRole(role);
	}

	@Override
	public Role createAdminRole() {
		Role role = new Role();
		role.setRoleName(ADMIN_ROLE);
		return createRole(role);
	}

	@Override
	public Role getRoleByName(String roleName) {
		// TODO Auto-generated method stub
		return roleRepository.findByName(roleName).orElseThrow(() -> 
				new RuntimeException("Cant n0t found role with name: " + roleName));
	}
}

