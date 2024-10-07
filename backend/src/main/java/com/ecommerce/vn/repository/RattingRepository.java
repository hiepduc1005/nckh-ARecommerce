package com.ecommerce.vn.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.entity.ratting.Ratting;

@Repository
public interface RattingRepository extends JpaRepository<Ratting, UUID>{

}
