package com.ecommerce.vn.service.notification;

import java.util.List;

import com.ecommerce.vn.entity.notification.Notification;
import com.ecommerce.vn.entity.user.User;

public interface NotificationService {
    
    void notifyUser(User customer, String message);

    void notifyAllUsers(String message);

    List<Notification> getCustomerNotifications(User customer);

}
