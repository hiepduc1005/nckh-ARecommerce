package com.ecommerce.vn.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.vn.dto.notification.NotificationCreateRequest;
import com.ecommerce.vn.dto.notification.NotificationResponse;
import com.ecommerce.vn.entity.notification.Notification;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.service.convert.NotificationConvert;
import com.ecommerce.vn.service.notification.NotificationService;
import com.ecommerce.vn.service.user.UserService;

@RestController
@RequestMapping("api/v1/notifications")
public class NotificationController {
	
	@Autowired
	private NotificationService notificationService;
	
	@Autowired
	private NotificationConvert notificationConvert;
	
	@Autowired
    private SimpMessagingTemplate messagingTemplate;
	
	@Autowired
	private UserService userService;

	@PostMapping
	public ResponseEntity<NotificationResponse> createNotifi(@RequestBody NotificationCreateRequest createRequest){
		Notification notification = notificationConvert.notificationCreateConvertToNotification(createRequest);
		notification = notificationService.notifyUser(notification);
	
		NotificationResponse response = notificationConvert.notificationConvertToNotificationResponse(notification);
		UUID userId = response.getUserId();
		
		messagingTemplate.convertAndSendToUser(userId.toString(), "/queue/notifications", response);
		
		
		return ResponseEntity.ok(response);
	}
	
	
	@GetMapping("/user/{userId}")
	public ResponseEntity<Page<NotificationResponse>> getNotificationsByUser(
			@PathVariable UUID userId,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "8") int size){
		
		User user = userService.findUserByUuId(userId);
		Page<Notification> notifiPage = notificationService.getCustomerNotifications(user, page, size);
		Pageable pageable = notifiPage.getPageable();
		long total = notifiPage.getTotalElements();
		List<NotificationResponse> notificationResponses = notifiPage.stream().map(notifi -> notificationConvert.notificationConvertToNotificationResponse(notifi)).toList();
	
		Page<NotificationResponse> response = new PageImpl<>(notificationResponses, pageable, total);
		
		return ResponseEntity.ok(response);
	}
	
	@PutMapping("/{notificationId}/read")
	public ResponseEntity<NotificationResponse> markAsRead(@PathVariable UUID notificationId){
		Notification notification = notificationService.getNotifiById(notificationId);
		notification = notificationService.markAsRead(notification);
		
		NotificationResponse response = notificationConvert.notificationConvertToNotificationResponse(notification);
		
		return ResponseEntity.ok(response);
	}
	
	@PutMapping("/read")
	public ResponseEntity<?> markAsReadAll(@RequestBody List<UUID> ids){
		
		notificationService.markAllAsReadIds(ids);
		
		return ResponseEntity.ok("Chuyển tất cả thông báo sang đã đọc thanh công!");
	}
	
	@PutMapping("/user/{userId}/read")
	public ResponseEntity<?> markAsReadAll(@PathVariable UUID userId){
		
		notificationService.markAllAsReadByUser(userId);
		
		return ResponseEntity.ok("Chuyển tất cả thông báo sang đã đọc thanh công!");
	}
	
	@DeleteMapping("/{notificationId}")
	public ResponseEntity<String> deleteNotification(@PathVariable UUID notificationId){
		notificationService.deleteNotifi(notificationId);
		
		return ResponseEntity.ok("Xóa thông báo thành công!");
	}
	
	@DeleteMapping("/delete")
	public ResponseEntity<String> deleteAllNotification(@RequestBody List<UUID> ids){
		notificationService.deleteAllNotifi(ids);
		
		return ResponseEntity.ok("Xóa tất cả thông báo thành công!");
	}
	
	@GetMapping("/test")
	public ResponseEntity<?> test(
			){
		
		messagingTemplate.convertAndSendToUser("fd2d52b5-069a-4cf1-9ebc-f72b52fbf5ae", "/queue/notifications", "HELLO");

		messagingTemplate.convertAndSend("/topic/fd2d52b5-069a-4cf1-9ebc-f72b52fbf5ae", "Broadcast test message");
		return ResponseEntity.ok("Ok");
	}
	
	
	
}
