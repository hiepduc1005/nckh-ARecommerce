package com.ecommerce.vn.service.notification.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.entity.notification.Notification;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.repository.NotificationRepository;
import com.ecommerce.vn.service.notification.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService {
	
	@Autowired
	private NotificationRepository notificationRepository;
	

	@Override
	public void notifyUser(User customer, String message) {
		Notification notification = new Notification();
		notification.setUser(customer);
		notification.setMessage(message);
		
		notificationRepository.save(notification);
	}

	@Override
	public void notifyAllUsers(String message) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public List<Notification> getCustomerNotifications(User customer) {
		
		return customer.getNotifications();
	}

}
