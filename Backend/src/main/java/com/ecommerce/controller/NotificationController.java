package com.ecommerce.controller;

import com.ecommerce.dto.notification.NotificationCreateRequest;
import com.ecommerce.dto.notification.NotificationResponse;
import com.ecommerce.dto.notification.NotificationUpdateRequest;
import com.ecommerce.service.notification.NotificationService;
import com.ecommerce.service.customer.CustomerService;
import com.ecommerce.service.convert.NotificationConvert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.ecommerce.entity.customer.Customer;
import com.ecommerce.entity.notification.Notification;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private NotificationConvert notificationConvert;

    // Tạo thông báo mới
    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(@RequestBody NotificationCreateRequest request) {
        Customer customer = customerService.getCustomerById(request.getCustomerId(), null, null);
        Notification notification = notificationService.createNotification(notificationConvert.notificationCreateRequestConvert(request, customer));
        NotificationResponse response = notificationConvert.notificationConvertToNotificationResponse(notification);
        return ResponseEntity.status(201).body(response);
    }

    // Lấy thông báo theo ID
    @GetMapping("/{notificationId}")
    public ResponseEntity<NotificationResponse> getNotificationById(@PathVariable UUID notificationId) {
        Notification notification = notificationService.getNotificationById(notificationId);
        NotificationResponse response = notificationConvert.notificationConvertToNotificationResponse(notification);
        return ResponseEntity.ok(response);
    }

    // Lấy tất cả thông báo của khách hàng
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<NotificationResponse>> getNotificationsByCustomer(@PathVariable UUID customerId) {
        List<Notification> notifications = notificationService.getNotificationsByCustomer(customerId);
        List<NotificationResponse> responses = notifications.stream()
                .map(notificationConvert::notificationConvertToNotificationResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Cập nhật trạng thái đã đọc của thông báo
    @PutMapping("/{notificationId}")
    public ResponseEntity<NotificationResponse> updateNotificationStatus(@PathVariable UUID notificationId, @RequestBody NotificationUpdateRequest request) {
        Notification updatedNotification = notificationService.updateNotificationStatus(notificationId, request.isRead());
        NotificationResponse response = notificationConvert.notificationConvertToNotificationResponse(updatedNotification);
        return ResponseEntity.ok(response);
    }

    // Xóa thông báo
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable UUID notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.noContent().build();
    }
}
