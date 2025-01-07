package com.ecommerce.vn.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.entity.notification.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification,UUID>{


    List<Notification> findByIsGlobal(boolean isGlobal);
}
