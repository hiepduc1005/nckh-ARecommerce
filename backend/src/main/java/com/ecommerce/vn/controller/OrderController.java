package com.ecommerce.vn.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.vn.dto.order.OrderCreateRequest;
import com.ecommerce.vn.dto.order.OrderResponse;
import com.ecommerce.vn.dto.order.OrderStatusUpdateCreateRequest;
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
    public ResponseEntity<?> createOrder(@RequestBody OrderCreateRequest orderCreateRequest) {
		 Optional<Order> existingOrder = orderService.findPendingOrderByUser(orderCreateRequest.getEmail());

	    if (existingOrder.isPresent()) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                .body("Bạn đã có đơn hàng đang chờ thanh toán!");
	    }
		
		Order order = orderConvert.orderCreateConvertToOrder(orderCreateRequest);
		
		order = orderService.createOrder(order);
		
		OrderResponse orderResponse = orderConvert.orderConvertToOrderResponse(order);
		
		return ResponseEntity.ok(orderResponse);
	}
	
	@GetMapping("/pagination")
    public ResponseEntity<Page<OrderResponse>> getOrdersWithPaginationAndSorting(
            @RequestParam("page") int page,
            @RequestParam("size") int size,
            @RequestParam(value ="sortBy" , required = false) String sortBy) {
    	
    	Page<Order> orders = orderService.getOrdersWithPaginationAndSorting(page, size, sortBy);
        
    	Page<OrderResponse> orderResponse = orders.map(order -> orderConvert.orderConvertToOrderResponse(order));
    	return new ResponseEntity<>(orderResponse, HttpStatus.OK);
    }

	
	@GetMapping("/{orderId}")
	public ResponseEntity<OrderResponse> getOrderById(@PathVariable(name = "orderId") UUID orderId){
		Order order = orderService.getOrderById(orderId);
		OrderResponse orderResponse = orderConvert.orderConvertToOrderResponse(order);
	
		return ResponseEntity.ok(orderResponse);
	}
	
	@GetMapping("/code/{orderCode}")
	public ResponseEntity<OrderResponse> getOrderByCode(@PathVariable(name = "orderCode") String orderCode){
		Order order = orderService.getOrderByCode(orderCode).orElseThrow(() -> new RuntimeException("Cant not found order with code : " + orderCode));
		OrderResponse orderResponse = orderConvert.orderConvertToOrderResponse(order);
	
		return ResponseEntity.ok(orderResponse);
	}
	
	@GetMapping
	public ResponseEntity<List<OrderResponse>> getAllOrders(){
		List<Order> orders = orderService.getAllOrders();
		List<OrderResponse> orderResponses = orders.stream().map((order) -> orderConvert.orderConvertToOrderResponse(order)).toList();
	
		return ResponseEntity.ok(orderResponses);
	}
	
	@GetMapping("/status/{orderStatus}/user")
	public ResponseEntity<List<OrderResponse>> getOrdersUserByStatus(@PathVariable(name = "orderStatus", required = false) OrderStatus orderStatus){
		
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		List<OrderResponse> orders = orderService.getOrdersByUserEmail(email)
				.stream()
				.filter((order) -> orderStatus.equals(OrderStatus.ALL) ? true : order.getOrderStatus().equals(orderStatus))
				.map((order) -> orderConvert.orderConvertToOrderResponse(order))
				.toList();
		
		return ResponseEntity.ok(orders);
	}

	@GetMapping("/status/{orderStatus}")
	public ResponseEntity<Page<OrderResponse>> getOrdersByStatus(
			@PathVariable(name = "orderStatus", required = false) OrderStatus orderStatus,
			@RequestParam(name = "keyword" , defaultValue = "") String keword,
			@RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue =  "8") int size ){
		
		Page<Order> orders = orderService.getOrdersByStatus(orderStatus,keword,page,size);
    	Page<OrderResponse> orderResponse = orders.map(order -> orderConvert.orderConvertToOrderResponse(order));

		return ResponseEntity.ok(orderResponse);
	}

	
	@PutMapping("/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(@RequestBody OrderStatusUpdateCreateRequest orderStatus) {
		Order order = orderService.updateOrderStatus(orderStatus.getOrderId(),orderStatus.getOrderStatus());
		
		OrderResponse orderResponse = orderConvert.orderConvertToOrderResponse(order);
		
		return ResponseEntity.ok(orderResponse);
	}
	
	@DeleteMapping("/{orderId}")
	public ResponseEntity<String> deleteOrder(@PathVariable(name = "orderId") UUID orderId){
		orderService.deleteOrder(orderId);
		return ResponseEntity.ok("Delete order success!");
	}

}
