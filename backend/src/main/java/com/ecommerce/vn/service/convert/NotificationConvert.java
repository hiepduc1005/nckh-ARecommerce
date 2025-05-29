package com.ecommerce.vn.service.convert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.notification.NotificationCreateRequest;
import com.ecommerce.vn.dto.notification.NotificationResponse;
import com.ecommerce.vn.entity.notification.Notification;
import com.ecommerce.vn.service.user.UserService;

@Service
public class NotificationConvert {
	
	@Autowired
	private UserService userService;
	
	public Notification notificationCreateConvertToNotification(NotificationCreateRequest createRequest) {
		Notification notification = new Notification();
		notification.setMessage(createRequest.getMessage());
		notification.setTitle(createRequest.getTitle());
		notification.setUrl(createRequest.getUrl());
		notification.setUser(userService.findUserByUuId(createRequest.getUserId()));
		
		return notification;
	}
	
	public NotificationResponse notificationConvertToNotificationResponse(Notification notification) {
		NotificationResponse notificationResponse = new NotificationResponse();
		notificationResponse.setId(notification.getId());
		notificationResponse.setMessage(notification.getMessage());
		notificationResponse.setRead(notification.isIsRead());
		notificationResponse.setTitle(notification.getTitle());
		notificationResponse.setCreateAt(notification.getCreatedAt());
		notificationResponse.setUserId(notification.getUser().getId());
		notificationResponse.setUrl(notification.getUrl());
		return notificationResponse;
	}

}
