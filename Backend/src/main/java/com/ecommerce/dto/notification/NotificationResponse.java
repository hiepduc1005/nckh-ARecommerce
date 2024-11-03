package com.ecommerce.dto.notification;

import java.time.LocalDateTime;
import java.util.UUID;

public class NotificationResponse {

    private UUID id;
    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;
    private UUID customerId;

    public NotificationResponse(UUID id, String message, boolean isRead, LocalDateTime createdAt, UUID customerId) {
        this.id = id;
        this.message = message;
        this.isRead = isRead;
        this.createdAt = createdAt;
        this.customerId = customerId;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean isRead) {
        this.isRead = isRead;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public UUID getCustomerId() {
        return customerId;
    }

    public void setCustomerId(UUID customerId) {
        this.customerId = customerId;
    }
}
