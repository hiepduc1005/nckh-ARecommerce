package com.ecommerce.service.notification;

import java.util.List;

import com.ecommerce.entity.customer.Customer;
import com.ecommerce.entity.notification.Notification;

public interface NotificationService {
    
    void notifyCustomer(Customer customer, String message);

    void notifyAllUsers(String message);

    List<Notification> getCustomerNotifications(Customer customer);

}
