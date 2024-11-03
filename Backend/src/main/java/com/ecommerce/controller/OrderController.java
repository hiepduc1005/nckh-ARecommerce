package com.ecommerce.controller;

import com.ecommerce.service.order.OrderService;
import com.ecommerce.service.convert.OrderConvert;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import com.ecommerce.dto.Order.OrderCreateRequest;
import com.ecommerce.dto.Order.OrderResponse;
import com.ecommerce.dto.Order.OrderUpdateRequest;
import com.ecommerce.entity.order.Order;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;
    private final OrderConvert orderConvert;

    public OrderController(OrderService orderService, OrderConvert orderConvert) {
        this.orderService = orderService;
        this.orderConvert = orderConvert;
    }

    @PostMapping // Tạo một đơn hàng mới
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderCreateRequest request) {
        Order order = orderConvert.orderCreateRequestConvert(request);
        Order createdOrder = orderService.createOrder(order);
        OrderResponse response = orderConvert.orderConvertToOrderResponse(createdOrder);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{orderId}") // Lấy thông tin đơn hàng theo ID
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable UUID orderId) {
        Order order = orderService.getOrderById(orderId);
        OrderResponse response = orderConvert.orderConvertToOrderResponse(order);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{orderId}") // Cập nhật thông tin đơn hàng
    public ResponseEntity<OrderResponse> updateOrder(@PathVariable UUID orderId,
            @RequestBody OrderUpdateRequest request) {
        Order updatedOrder = orderConvert.orderUpdateRequestConvert(request, orderService.getOrderById(orderId));
        Order order = orderService.updateOrder(orderId, updatedOrder);
        OrderResponse response = orderConvert.orderConvertToOrderResponse(order);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{orderId}") // Xóa đơn hàng
    public ResponseEntity<Void> deleteOrder(@PathVariable UUID orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping // Lấy tất cả các đơn hàng
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        List<OrderResponse> responses = orders.stream()
                .map(orderConvert::orderConvertToOrderResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

}
