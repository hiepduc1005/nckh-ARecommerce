package com.ecommerce.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.entity.customer.Customer;
import com.ecommerce.entity.notification.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    List<Notification> findByCustomer(Customer customer);

    List<Notification> findByIsGlobal(boolean isGlobal);

    Notification findByNotificationId(UUID notificationId);

    List<Notification> findByCustomerId(UUID customerId);

}
