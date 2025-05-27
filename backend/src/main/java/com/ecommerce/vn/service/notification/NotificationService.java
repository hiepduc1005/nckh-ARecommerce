package com.ecommerce.vn.service.notification;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import org.springframework.data.domain.Page;

import com.ecommerce.vn.entity.notification.Notification;
import com.ecommerce.vn.entity.user.User;

public interface NotificationService {
    
	Notification notifyUser(Notification notification);
	
	Notification getNotifiById(UUID notifiId);
	
    void notifyAllUsers(String message,String title);

    Page<Notification> getCustomerNotifications(User customer, int page, int size);

    Notification markAsRead(Notification notification);
    
    List<Notification> markAllAsRead(List<Notification> notifications);
    
    List<Notification> markAllAsReadIds(List<UUID> ids);
    
    void markAllAsReadByUser(UUID userId);

    
    CompletableFuture<Void> sendCancelOrderNotification(String orderId, UUID userId);
    
    CompletableFuture<Void> sendShippedOrderNotification(String orderId, UUID userId);

    CompletableFuture<Void> sendDeliveredOrderNotification(String orderId, UUID userId);

    CompletableFuture<Void> sendPaidOrderNotification(String orderId, UUID userId);

    void deleteNotifi(UUID notificationId);
    void deleteAllNotifi(List<UUID> ids);
}
