package com.ecommerce.dto.notification;
import java.util.UUID;

public class NotificationCreateRequest {
    private UUID customerId;
    private String message;

    // Getters and Setters
    public UUID getCustomerId() {
        return customerId;
    }

    public void setCustomerId(UUID customerId) {
        this.customerId = customerId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

