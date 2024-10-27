package com.ecommerce.service.role;

import java.util.List;
import java.util.UUID;

import com.ecommerce.entity.role.Role;

public interface RoleService {

    Role createRole(Role role);

    Role updateRole(UUID id, Role roleDetails);

    void deleteRole(UUID id);

    Role getRoleById(UUID id);

    List<Role> getAllRoles();
}
