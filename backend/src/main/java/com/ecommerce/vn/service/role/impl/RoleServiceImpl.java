package com.ecommerce.vn.service.role.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.vn.entity.role.Privilege;
import com.ecommerce.vn.entity.role.Role;
import com.ecommerce.vn.repository.RoleRepository;
import com.ecommerce.vn.service.role.RoleService;

@Service
@Transactional
public class RoleServiceImpl implements RoleService {
	
	private RoleRepository roleRepository;

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
		// TODO Auto-generated method stub
		
	}

	@Override
	public Role getRoleById(UUID id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Role> getAllRoles() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Role createCustomerRole() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Role createModeratorRole() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Role createSupportRole() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Role createAdminRole() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Role getRoleByName() {
		// TODO Auto-generated method stub
		return null;
	}
}

