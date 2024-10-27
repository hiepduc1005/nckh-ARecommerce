package com.ecommerce.service.notification.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.entity.customer.Customer;
import com.ecommerce.entity.notification.Notification;
import com.ecommerce.repository.NotificationRepository;
import com.ecommerce.service.notification.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public void notifyCustomer(Customer customer, String message) {
        Notification notification = new Notification();
        notification.setCustomer(customer); // Gửi thông báo đến Customer
        notification.setMessage(message);
        notificationRepository.save(notification);
    }

    @Override
    public void notifyAllUsers(String message) {
        Notification notification = new Notification();
        notification.setMessage(message);
        notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getCustomerNotifications(Customer customer) {
        return notificationRepository.findByCustomer(customer);
    }

}
