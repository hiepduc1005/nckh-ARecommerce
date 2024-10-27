package com.ecommerce.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.entity.product.Tag;

@Repository
public interface TagRepository extends JpaRepository<Tag,UUID>{
    Tag findTagById(UUID tagId);
    boolean existsByName(String name);
}
