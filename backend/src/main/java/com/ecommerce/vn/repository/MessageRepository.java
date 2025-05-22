package com.ecommerce.vn.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ecommerce.vn.entity.message.Message;
import com.ecommerce.vn.entity.user.User;

public interface MessageRepository extends JpaRepository<Message, UUID>{

	@Query("SELECT m FROM Message m WHERE m.user = :user ORDER BY m.timestamp DESC")
	Page<Message> getMessageByUsers(@Param("user") User user, Pageable pageable);
}
