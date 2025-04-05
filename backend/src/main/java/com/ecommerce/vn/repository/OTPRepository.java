package com.ecommerce.vn.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ecommerce.vn.entity.OTP;

public interface OTPRepository extends JpaRepository<OTP, UUID>{

	@Query("SELECT o FROM OTP o WHERE o.email = :email")
	Optional<OTP> getOTPByEmail(String email);
}
