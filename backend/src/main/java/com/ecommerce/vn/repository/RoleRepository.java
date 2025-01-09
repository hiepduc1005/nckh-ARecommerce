package com.ecommerce.vn.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.entity.role.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID>{

	@Query("SELECT r FROM Role r WHERE r.roleName = :roleName")
	Optional<Role> findByName(@Param("roleName") String roleName);
}
