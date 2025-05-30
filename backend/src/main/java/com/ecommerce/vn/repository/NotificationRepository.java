package com.ecommerce.vn.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.entity.notification.Notification;
import com.ecommerce.vn.entity.user.User;

import jakarta.transaction.Transactional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification,UUID>{

	@Query("SELECT n FROM Notification n WHERE n.user = :user ORDER BY n.createdAt DESC")
	Page<Notification> findByUser(@Param("user") User user, Pageable pageable);

	@Transactional
	@Modifying
	@Query("UPDATE Notification n SET n.isRead = true WHERE n.user.id = :userId")
	void markAllAsRead(@Param("userId") UUID userId );
}
