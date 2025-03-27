package com.ecommerce.vn.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.ecommerce.vn.entity.order.Order;
import com.ecommerce.vn.entity.order.OrderStatus;
import com.ecommerce.vn.repository.OrderRepository;

@Component
public class OrderCleanupTask {
    @Autowired
    private OrderRepository orderRepository;

    @Scheduled(fixedRate = 300000) 
    public void cancelExpiredOrders() {
        List<Order> expiredOrders = orderRepository.findExpiredOrders(LocalDateTime.now());
        for (Order order : expiredOrders) {
            order.setOrderStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);
        }
    }
} 