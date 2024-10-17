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

    @Autowired
    private RoleRepository roleRepository;  

    @Override
    public Role createRole(Role role) {
        return roleRepository.save(role);
    }

    @Override
    public Role updateRole(UUID id, Role roleDetails) {

        Optional<Role> optionalRole = roleRepository.findById(id);
        if (optionalRole.isPresent()) {
            Role role = optionalRole.get();
            
            role.setRoleName(roleDetails.getRoleName());
            role.setPrivileges(roleDetails.getPrivileges());
            return roleRepository.save(role);
        } else {
            throw new RuntimeException("Role not found with id: " + id);
        }
    }

    @Override
    public void deleteRole(UUID id) {
        Optional<Role> optionalRole = roleRepository.findById(id);
        if (optionalRole.isPresent()) {
            roleRepository.delete(optionalRole.get());
        } else {
            throw new RuntimeException("Role not found with id: " + id);
        }
    }

    @Override
    public Role getRoleById(UUID id) {
        
        Optional<Role> optionalRole = roleRepository.findById(id);
        if (optionalRole.isPresent()) {
            return optionalRole.get();
        } else {
            throw new RuntimeException("Role not found with id: " + id);
        }
    }

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

	@Override
	public Role createCustomerRole() {
		Role roleCustomer = new Role("ROLE_CUSTOMER");
		roleCustomer.addPrivilege(Privilege.CREATE_ORDER);
		roleCustomer.addPrivilege(Privilege.VIEW_PRODUCT);
		roleCustomer.addPrivilege(Privilege.ADD_REVIEW);
		roleCustomer.addPrivilege(Privilege.VIEW_ORDER);
	    roleCustomer.addPrivilege(Privilege.VIEW_REVIEWS);
	    roleCustomer.addPrivilege(Privilege.MANAGE_USER_PROFILE);
		return roleCustomer;
	}

	@Override
	public Role createSellerRole() {
		Role sellerRole = new Role("ROLE_SELLER");
	    sellerRole.addPrivilege(Privilege.ADD_PRODUCT);
	    sellerRole.addPrivilege(Privilege.EDIT_PRODUCT);
	    sellerRole.addPrivilege(Privilege.DELETE_PRODUCT);
	    sellerRole.addPrivilege(Privilege.MANAGE_PRODUCT_STOCK);
	    sellerRole.addPrivilege(Privilege.VIEW_ORDER);
	    sellerRole.addPrivilege(Privilege.CANCEL_ORDER);
	    sellerRole.addPrivilege(Privilege.UPDATE_ORDER_STATUS);
	    sellerRole.addPrivilege(Privilege.MANAGE_SHIPPING_POLICY);
	    return sellerRole;
	}

	@Override
	public Role createModeratorRole() {
		Role moderatorRole = new Role("ROLE_MODERATOR");
	    moderatorRole.addPrivilege(Privilege.VIEW_PRODUCT);
	    moderatorRole.addPrivilege(Privilege.VIEW_REVIEWS);
	    moderatorRole.addPrivilege(Privilege.DELETE_REVIEW);
	    moderatorRole.addPrivilege(Privilege.APPROVE_PRODUCT);
	    moderatorRole.addPrivilege(Privilege.APPROVE_SELLER);
	    moderatorRole.addPrivilege(Privilege.DELETE_PRODUCT);
	    moderatorRole.addPrivilege(Privilege.CANCEL_ORDER);
	    return moderatorRole;
	}

	@Override
	public Role createSupportRole() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Role createAdminRole() {
		Role adminRole = new Role("ROLE_ADMIN");
	    adminRole.addPrivilege(Privilege.MANAGE_USERS);
	    adminRole.addPrivilege(Privilege.MANAGE_PRODUCT_STOCK);
	    adminRole.addPrivilege(Privilege.VIEW_ORDER);
	    adminRole.addPrivilege(Privilege.CREATE_PROMOTION);
	    adminRole.addPrivilege(Privilege.DELETE_PROMOTION);
	    adminRole.addPrivilege(Privilege.APPLY_PROMOTION);
	    adminRole.addPrivilege(Privilege.VIEW_SHIPPING_DETAILS);
	    adminRole.addPrivilege(Privilege.UPDATE_POLICY);
	    return adminRole;
	}
}

