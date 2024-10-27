package com.ecommerce.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.entity.user.UserAddress;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, UUID>{

}
