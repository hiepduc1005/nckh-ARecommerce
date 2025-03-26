package com.ecommerce.vn.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.vn.service.order.OrderService;

@RestController
@RequestMapping("/payment")
public class VNPayController {

	@Autowired
	private OrderService orderService;
	
}
