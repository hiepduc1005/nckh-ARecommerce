package com.ecommerce.service.convert;

import com.ecommerce.dto.notification.NotificationCreateRequest;
import com.ecommerce.dto.notification.NotificationResponse;
import com.ecommerce.entity.customer.Customer;
import com.ecommerce.entity.notification.Notification;

public class NotificationConvert {

    // Convert Create Request to Entity
    public Notification notificationCreateRequestConvert(NotificationCreateRequest request, Customer customer) {
        if (request == null || customer == null) {
            return null;
        }

        Notification notification = new Notification();
        notification.setCustomer(customer);
        notification.setMessage(request.getMessage());
        notification.setIsRead(false);

        return notification;
    }

    // Convert Entity to Response
    public NotificationResponse notificationConvertToNotificationResponse(Notification notification) {
        if (notification == null) {
            return null;
        }

        return new NotificationResponse(
                notification.getId(),
                notification.getMessage(),
                notification.isIsRead(),
                notification.getCreatedAt(),
                notification.getCustomer().getId()
        );
    }
}
