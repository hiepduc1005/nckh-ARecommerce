package com.ecommerce.vn.service.notification.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.notification.NotificationResponse;
import com.ecommerce.vn.entity.notification.Notification;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.repository.NotificationRepository;
import com.ecommerce.vn.service.convert.NotificationConvert;
import com.ecommerce.vn.service.notification.NotificationService;
import com.ecommerce.vn.service.user.UserService;

@Service
public class NotificationServiceImpl implements NotificationService {
	
    private static final Logger logger = LoggerFactory.getLogger(NotificationServiceImpl.class);

	@Autowired
	private NotificationRepository notificationRepository;
	
	@Autowired
	private UserService userService;
	
	
	@Autowired
    private SimpMessagingTemplate messagingTemplate;
	
	@Autowired
	private NotificationConvert convert;
	

	@Override
	public Notification notifyUser(Notification notification) {

		
		return notificationRepository.save(notification);
	}

	@Override
	public void notifyAllUsers(String message,String title) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public Page<Notification> getCustomerNotifications(User customer, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		return notificationRepository.findByUser(customer,pageable);
	}

	@Override
	public Notification markAsRead(Notification notification) {
		notification.setIsRead(true);
		
		return notificationRepository.save(notification);
	}

	@Override
	public List<Notification> markAllAsRead(List<Notification> notifications) {
		notifications.parallelStream().forEach(notification -> {
			notification.setIsRead(true);
		});
		return notificationRepository.saveAll(notifications);
		
		 
	}

	@Override
	@Async
	public CompletableFuture<Void> sendCancelOrderNotification(String orderId, UUID userId) {
		return CompletableFuture.runAsync(() -> {
            try {
                logger.info("Sending cancel order notification for order: {} to user: {}", orderId, userId);
                
                User user = userService.findUserByUuId(userId);
                if (user == null) {
                    logger.error("User not found with ID: {}", userId);
                    return;
                }
                
                String title = "Đơn hàng đã bị hủy";
                String message = "Đơn hàng #" + orderId + " của bạn đã bị hủy.";
                String url = "/user/purchase/progress/" + orderId;
                
                Notification notification = createNotification(title, message, user, url);
                Notification savedNotification = notificationRepository.save(notification);
                
                // Gửi real-time notification
                sendRealTimeNotification(savedNotification);
                
                logger.info("Successfully sent cancel order notification to user: {}", userId);
                
            } catch (Exception e) {
                logger.error("Error sending cancel order notification: {}", e.getMessage(), e);
                throw new RuntimeException("Failed to send cancel order notification", e);
            }
        });

	}
	

	@Override
    @Async
    public CompletableFuture<Void> sendShippedOrderNotification(String orderId, UUID userId) {
        return CompletableFuture.runAsync(() -> {
            try {
                logger.info("Sending shipped order notification for order: {} to user: {}", orderId, userId);
                
                User user = userService.findUserByUuId(userId);
                if (user == null) {
                    logger.error("User not found with ID: {}", userId);
                    return;
                }
                
                String title = "Đơn hàng đang được giao";
                String message = "Đơn hàng #" + orderId + " của bạn đang được vận chuyển.";
                String url = "/user/purchase/progress/" + orderId;
                
                Notification notification = createNotification(title, message, user, url);
                Notification savedNotification = notificationRepository.save(notification);
                
                sendRealTimeNotification(savedNotification);
                
                logger.info("Successfully sent shipped order notification to user: {}", userId);
                
            } catch (Exception e) {
                logger.error("Error sending shipped order notification: {}", e.getMessage(), e);
                throw new RuntimeException("Failed to send shipped order notification", e);
            }
        });
    }

    @Override
    @Async
    public CompletableFuture<Void> sendDeliveredOrderNotification(String orderId, UUID userId) {
        return CompletableFuture.runAsync(() -> {
            try {
                logger.info("Sending delivered order notification for order: {} to user: {}", orderId, userId);
                
                User user = userService.findUserByUuId(userId);
                if (user == null) {
                    logger.error("User not found with ID: {}", userId);
                    return;
                }
                
                String title = "Đơn hàng đã được giao";
                String message = "Đơn hàng #" + orderId + " đã được giao thành công. Cảm ơn bạn đã mua hàng!";
                String url = "/user/purchase/progress/" + orderId;
                
                Notification notification = createNotification(title, message, user, url);
                Notification savedNotification = notificationRepository.save(notification);
                
                sendRealTimeNotification(savedNotification);
                
                logger.info("Successfully sent delivered order notification to user: {}", userId);
                
            } catch (Exception e) {
                logger.error("Error sending delivered order notification: {}", e.getMessage(), e);
                throw new RuntimeException("Failed to send delivered order notification", e);
            }
        });
    }

    @Override
    @Async
    public CompletableFuture<Void> sendPaidOrderNotification(String orderId, UUID userId) {
        return CompletableFuture.runAsync(() -> {
            try {
                logger.info("Sending paid order notification for order: {} to user: {}", orderId, userId);
                
                User user = userService.findUserByUuId(userId);
                if (user == null) {
                    logger.error("User not found with ID: {}", userId);
                    return;
                }
                
                String title = "Thanh toán thành công";
                String message = "Đơn hàng #" + orderId + " đã được thanh toán thành công. Đơn hàng sẽ được xử lý sớm nhất.";
                String url = "/user/purchase/progress/" + orderId;
                
                Notification notification = createNotification(title, message, user, url);
                Notification savedNotification = notificationRepository.save(notification);
                
                sendRealTimeNotification(savedNotification);
                
                logger.info("Successfully sent paid order notification to user: {}", userId);
                
            } catch (Exception e) {
                logger.error("Error sending paid order notification: {}", e.getMessage(), e);
                throw new RuntimeException("Failed to send paid order notification", e);
            }
        });
    }
	
    private void sendRealTimeNotification(Notification notification) {
        try {
            NotificationResponse response = convert.notificationConvertToNotificationResponse(notification);
            
            messagingTemplate.convertAndSendToUser(
                notification.getUser().getId().toString(),
                "/topic/" + notification.getUser().getId(),
                response
            );
            
            logger.debug("Real-time notification sent to user: {}", notification.getUser().getId());
            
        } catch (Exception e) {
            logger.error("Error sending real-time notification: {}", e.getMessage(), e);
            // Không throw exception ở đây để không ảnh hưởng đến việc lưu notification
        }
    }
    
    private Notification createNotification(String title, String message, User user, String url) {
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setUser(user);
        notification.setUrl(url);
        notification.setIsRead(false);
        return notification;
    }

	@Override
	public void deleteNotifi(UUID notifficationId) {
		Notification notification = getNotifiById(notifficationId);
		
		notificationRepository.delete(notification);
	}

	@Override
	public Notification getNotifiById(UUID notifiId) {
		if(notifiId == null) {
			throw new RuntimeException("notifficationId must not null!");
		}
		return notificationRepository.findById(notifiId).orElseThrow(() -> new RuntimeException("Cant not found notification with id: " + notifiId));
	}

	@Override
	public List<Notification> markAllAsReadIds(List<UUID> ids) {
		if(ids.isEmpty()) {
			return new ArrayList<>();
		}
		
		List<Notification> notifications = notificationRepository.findAllById(ids);
		
		
		return markAllAsRead(notifications);
				
	}

}
