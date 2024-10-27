package com.ecommerce.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.entity.attribute.Attribute;

public interface AttributeRepository extends JpaRepository<Attribute, UUID> {
}
