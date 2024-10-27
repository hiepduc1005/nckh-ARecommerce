package com.ecommerce.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.entity.role.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID>{

}
