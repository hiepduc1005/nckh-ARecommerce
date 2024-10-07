package com.ecommerce.vn.repository;

import java.util.UUID;

import javax.swing.text.html.HTML.Tag;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TagRepository extends JpaRepository<Tag,UUID>{

}
