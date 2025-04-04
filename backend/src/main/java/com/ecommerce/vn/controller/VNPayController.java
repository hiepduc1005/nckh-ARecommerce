package com.ecommerce.vn.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.vn.dto.order.OrderCreateRequest;
import com.ecommerce.vn.entity.order.Order;
import com.ecommerce.vn.entity.order.OrderStatus;
import com.ecommerce.vn.entity.order.PaymentMethod;
import com.ecommerce.vn.service.EmailService;
import com.ecommerce.vn.service.VNPayService;
import com.ecommerce.vn.service.convert.OrderConvert;
import com.ecommerce.vn.service.order.OrderService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/payment")
public class VNPayController {

	@Autowired
	private OrderService orderService;
	
	@Autowired
	private OrderConvert orderConvert;
	
	@Autowired
	private VNPayService vnPayService;
	
	@Autowired
	private EmailService emailService;
	
	private static final String FRONTEND_PAYMENT = "http://localhost:5173/payment-check";
	
	
	
	@PostMapping("/create-payment")
	public ResponseEntity<?> createPayment(@RequestBody OrderCreateRequest orderCreateRequest,
	                                       HttpServletResponse response,
	                                       HttpServletRequest request) throws IOException {
	    Optional<Order> existingOrder = orderService.findPendingOrderByUser(orderCreateRequest.getEmail());

	    if (existingOrder.isPresent()) {
	        return ResponseEntity.status(HttpStatus.CONFLICT)
	                .body("Bạn đã có đơn hàng đang chờ thanh toán!");
	    }

	    Order order = orderConvert.orderCreateConvertToOrder(orderCreateRequest);
	    order = orderService.createOrder(order);

	    if (order == null) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("Không thể tạo đơn hàng. Vui lòng thử lại sau.");
	    }

	    if (order.getPaymentMethod().equals(PaymentMethod.VNPAY)) {
	        String paymentUrl = vnPayService.createPaymentURL(order, request);
	        order.setPaymentUrl(paymentUrl);
            orderService.updateOrder(order);
	        return ResponseEntity.ok(paymentUrl);
	    }
	 

	    return ResponseEntity.ok("Đơn hàng được tạo thành công!");
	}
	
	 @GetMapping("/payment-return")
	    public ResponseEntity<?> paymentReturn(@RequestParam Map<String, String> queryParams) {

        String transactionStatus = queryParams.get("vnp_TransactionStatus");
        String orderCode = queryParams.get("vnp_TxnRef");

        Optional<Order> orderOptional = orderService.getOrderByCode(orderCode);

        if (orderOptional.isEmpty()) {
            return ResponseEntity.status(404).body("Không tìm thấy đơn hàng.");
        }

        Order order = orderOptional.get();
        String redirectUrl;

        if ("00".equals(transactionStatus)) {
            order.setOrderStatus(OrderStatus.PAID);
            order.setOrderApprovedAt(LocalDateTime.now());
            orderService.updateOrder(order);
            redirectUrl = FRONTEND_PAYMENT + "?orderCode=" + orderCode;
            
            Map<String, String> data = new HashMap<>();
            data.put("orderCode", orderCode);
            data.put("orderDate", LocalDateTime.now().toString());
            data.put("totalAmount", order.getTotalPrice().toString());

            emailService.sendOrderConfirmationEmail(order.getEmail(), data);
        } else {
            order.setOrderStatus(OrderStatus.CANCELLED);
            orderService.updateOrder(order);
            redirectUrl = FRONTEND_PAYMENT + "?orderCode=" + orderCode;
        }

        return ResponseEntity.status(302).header("Location", redirectUrl).build();
    }
	
		
	
}
