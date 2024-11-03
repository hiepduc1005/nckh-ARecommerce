package com.ecommerce.service.notification.impl;

import com.ecommerce.entity.notification.Notification;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.NotificationRepository;
import com.ecommerce.service.notification.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // Tạo mới một thông báo
    @Override
    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    // Lấy thông báo theo ID
    @Override
    public Notification getNotificationById(UUID notificationId) {
        return notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));
    }

    // Lấy tất cả thông báo của một khách hàng
    @Override
    public List<Notification> getNotificationsByCustomer(UUID customerId) {
        return notificationRepository.findByCustomerId(customerId);
    }

    // Cập nhật trạng thái đã đọc của thông báo
    @Override
    public Notification updateNotificationStatus(UUID notificationId, boolean isRead) {
        Notification notification = getNotificationById(notificationId);
        notification.setIsRead(isRead);
        return notificationRepository.save(notification);
    }

    // Xóa thông báo
    @Override
    public void deleteNotification(UUID notificationId) {
        if (!notificationRepository.existsById(notificationId)) {
            throw new ResourceNotFoundException("Notification", "id", notificationId);
        }
        notificationRepository.deleteById(notificationId);
    }
}
