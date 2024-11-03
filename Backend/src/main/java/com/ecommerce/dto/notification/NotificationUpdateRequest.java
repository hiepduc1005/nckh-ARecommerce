package com.ecommerce.dto.notification;

import java.util.UUID;

public class NotificationUpdateRequest {

    private UUID notificationId;
    private boolean isRead;

    // Getters and Setters
    public UUID getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(UUID notificationId) {
        this.notificationId = notificationId;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean isRead) {
        this.isRead = isRead;
    }
}
