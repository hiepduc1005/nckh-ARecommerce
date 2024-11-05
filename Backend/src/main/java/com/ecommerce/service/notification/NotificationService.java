package com.ecommerce.service.notification;

import java.util.List;
import java.util.UUID;

import com.ecommerce.entity.notification.Notification;

public interface NotificationService {

    Notification createNotification(Notification notification);

    Notification getNotificationById(UUID notificationId);

    List<Notification> getNotificationsByCustomer(UUID customerId);

    Notification updateNotificationStatus(UUID notificationId, boolean isRead);

    void deleteNotification(UUID notificationId);
}
