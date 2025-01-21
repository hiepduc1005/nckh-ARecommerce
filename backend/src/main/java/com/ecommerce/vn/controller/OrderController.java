package com.ecommerce.vn.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.vn.dto.order.OrderCreateRequest;
import com.ecommerce.vn.dto.order.OrderResponse;
import com.ecommerce.vn.entity.order.Order;
import com.ecommerce.vn.entity.order.OrderStatus;
import com.ecommerce.vn.service.convert.OrderConvert;
import com.ecommerce.vn.service.order.OrderService;

@RestController
@RequestMapping("api/v1/orders")
public class OrderController {
	@Autowired
	private OrderService orderService;
	
	@Autowired
	private OrderConvert orderConvert;
	
	@PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderCreateRequest orderCreateRequest) {
		Order order = orderConvert.orderCreateConvertToOrder(orderCreateRequest);
		order = orderService.createOrder(order);
		
		OrderResponse orderResponse = orderConvert.orderConvertToOrderResponse(order);
		
		return ResponseEntity.ok(orderResponse);
	}
	
	@GetMapping("/{orderId}")
	public ResponseEntity<OrderResponse> getOrderById(@PathVariable(name = "orderId") UUID orderId){
		Order order = orderService.getOrderById(orderId);
		OrderResponse orderResponse = orderConvert.orderConvertToOrderResponse(order);
	
		return ResponseEntity.ok(orderResponse);
	}
	
	@GetMapping
	public ResponseEntity<List<OrderResponse>> getAllOrders(){
		List<Order> orders = orderService.getAllOrders();
		List<OrderResponse> orderResponses = orders.stream().map((order) -> orderConvert.orderConvertToOrderResponse(order)).toList();
	
		return ResponseEntity.ok(orderResponses);
	}
	
	@PutMapping("/status/{orderId}")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable(name = "orderId") UUID orderId, @RequestBody OrderStatus orderStatus) {
		Order order = orderService.updateOrderStatus(orderId,orderStatus);
		
		OrderResponse orderResponse = orderConvert.orderConvertToOrderResponse(order);
		
		return ResponseEntity.ok(orderResponse);
	}
	
	@DeleteMapping("/{orderId}")
	public ResponseEntity<String> deleteOrder(@PathVariable(name = "orderId") UUID orderId){
		orderService.deleteOrder(orderId);
		return ResponseEntity.ok("Delete order success!");
	}

}
