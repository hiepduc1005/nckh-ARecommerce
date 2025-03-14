package com.ecommerce.vn.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.entity.user.UserAddress;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, UUID>{
	
	@Query("select ua from UserAddress ua where ua.user.id = :userId")
	List<UserAddress> getUserAddressesByUser(@Param("userId") UUID userId);
}
