package com.ecommerce.vn.service.order.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.vn.config.Utils;
import com.ecommerce.vn.entity.coupon.Coupon;
import com.ecommerce.vn.entity.order.Order;
import com.ecommerce.vn.entity.order.OrderStatus;
import com.ecommerce.vn.entity.order.OrderStatusHistory;
import com.ecommerce.vn.entity.order.PaymentMethod;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.repository.OrderRepository;
import com.ecommerce.vn.service.EmailService;
import com.ecommerce.vn.service.coupon.CouponService;
import com.ecommerce.vn.service.order.OrderService;
import com.ecommerce.vn.service.user.UserService;


@Service
@Transactional
public class OrderServiceImpl implements OrderService {
	
	@Autowired
	private OrderRepository orderRepository;
	
	@Autowired
	private CouponService couponService;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private EmailService emailService;

	@Override
	public Order createOrder(Order order) {
		
		if(isOrderEmpty(order)) {
			throw new RuntimeException("Order is empty!");
		}
		
		order.getOrderItems().stream().forEach(orderItem -> {
			if(orderItem.getQuantity() > orderItem.getVariant().getQuantity()) {
				throw new RuntimeException("Số sản phẩm có sẵn không đủ!");
			}
			orderItem.getVariant().setQuantity(orderItem.getVariant().getQuantity() -  orderItem.getQuantity() );
		});
		
		String code;
	    int attempts = 0;
	    do {
	        code = Utils.generateSecureRandomString();
	        attempts++;
	        if (attempts > 10) { // Tránh vòng lặp vô tận
	            throw new RuntimeException("Failed to generate a unique order code after multiple attempts.");
	        }
	    } while (orderRepository.existsByCode(code));
	
		order.setOrderStatus(OrderStatus.PENDING);

		
		order.setExpiresAt(LocalDateTime.now().plusMinutes(15));
		order.setCode(code);	
		order.setShippingFee(BigDecimal.ONE);
		order.setShippingMethod("");
		Coupon coupon = order.getCoupon();
		BigDecimal totalPrice = calculateTotalPrice(order);
		order.setTotalPrice(totalPrice);			
		if(coupon != null) {
			BigDecimal discountPrice = calculateTotalPriceWithCoupon(order,coupon);
			order.setDiscountPrice(discountPrice);
			
		}
		
		order.setOrderStatusHistories(Arrays.asList(new OrderStatusHistory(order.getOrderStatus(), order)));
		
		return orderRepository.save(order);
	}

	@Override
	public Order getOrderById(UUID orderId) {
		if(orderId == null) {
			throw new RuntimeException("Order id is null!");
		}
		return orderRepository.findById(orderId).orElseThrow(
				() -> new RuntimeException("Cant not found order with id :" + orderId));
	}

	@Override
	public List<Order> getAllOrders() {
		
		return orderRepository.findAll();
	}

	@Override
	public Order updateOrder(Order updatedOrder) {
		if(updatedOrder.getId() == null) {
			throw new RuntimeException("Order id id null");
		}
		
		Order order = orderRepository.findById(updatedOrder.getId()).get();
		if(orderRepository.findById(updatedOrder.getId()).isEmpty()) {
			throw new RuntimeException("Order not found");
		}
		
		if(!order.getOrderStatus().equals(updatedOrder.getOrderStatus())) {
			List<OrderStatusHistory> histories = order.getOrderStatusHistories();
			histories.add(new OrderStatusHistory(updatedOrder.getOrderStatus(), updatedOrder));
			updatedOrder.setOrderStatusHistories(histories);
		}
		return orderRepository.save(updatedOrder);
	}

	@Override
	public void deleteOrder(UUID orderId) {
		Order order = getOrderById(orderId);
		
		orderRepository.delete(order);
	}

	@Override
	public Order updateOrderStatus(UUID orderId, OrderStatus orderStatus) {
		Order order = getOrderById(orderId);
		if(order != null) {
		    OrderStatus currentStatus = order.getOrderStatus();
		   
		    if (!isValidStatusTransition(currentStatus, orderStatus,order)) {
		        throw new IllegalStateException("Không thể chuyển trạng thái từ " + currentStatus + " sang " + orderStatus);
		    }
		    
		    List<OrderStatusHistory> histories = order.getOrderStatusHistories();
		    histories.add(new OrderStatusHistory(orderStatus, order));

		    order.setOrderStatusHistories(histories);
			order.setOrderStatus(orderStatus);
			updateOrder(order);
			try {
				sendEmailByStatus(orderStatus,order);
			} catch (IOException e) {
				
				e.printStackTrace();
			}
		}

		return order;
	}
	
	private boolean isValidStatusTransition(OrderStatus current, OrderStatus next, Order order) {
	    switch (current) {
	        case PENDING:
	            return next == OrderStatus.CANCELLED || next == OrderStatus.PAID || next == OrderStatus.PROCESSING;
	        case PAID:
	            return next == OrderStatus.PROCESSING || next == OrderStatus.REFUNDED || (!order.getPaymentMethod().equals(PaymentMethod.COD) && next == OrderStatus.SHIPPED);
	        case PROCESSING:
	            return next == OrderStatus.SHIPPED || next == OrderStatus.CANCELLED;
	        case SHIPPED:
	            return next == OrderStatus.DELIVERED;
	        case DELIVERED:
	            return next == OrderStatus.REFUNDED;
	        case CANCELLED:
	        case REFUNDED:
	            return false; // Không được chuyển từ trạng thái cuối
	        default:
	            return false;
	    }
	}
	
	private void sendEmailByStatus(OrderStatus status, Order order) throws IOException {
	    switch (status) {
	        case PENDING:
	        	break;
	        case PAID:
	        	break;
	        case PROCESSING:
	        	emailService.sendConfirmOrderEmail(order.getEmail(), order.getEmail(), order);
	        	break;
	        case SHIPPED:
	        	break;
	        case DELIVERED:
	        	Coupon coupon = couponService.createGiftCoupon(10.0);
	        	emailService.sendSuccessDeliveryEmail(order.getEmail(), order.getEmail(), coupon, order);
	        	break;
	        case CANCELLED:
	        	Coupon c = couponService.createGiftCoupon(15.0);
	        	emailService.sendCancelOrderEmail(order.getEmail(), order.getEmail(), order, c);
	        	break;
	        default:
	    }
	}
	
	@Override
	public Order applyCouponToOrder(String couponCode, Order order) {
		if(couponCode.isEmpty()) {
			throw new RuntimeException("Invalid coupon code");
		}
		
		Coupon coupon = couponService.getCouponByCode(couponCode);
		if (coupon != null) {
			order.setCoupon(coupon);
			
			BigDecimal discountPrice = calculateTotalPriceWithCoupon(order, coupon);
			order.setDiscountPrice(discountPrice);
		}
		return updateOrder(order);
	}

	@Override
	public Order addCouponToOrder(UUID orderId, Coupon coupon) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public BigDecimal calculateTotalPriceWithCoupon(Order order, Coupon coupon) {
		BigDecimal totalPrice = BigDecimal.ZERO;
		
		if (coupon == null || coupon.getDiscountType() == null || coupon.getDiscountValue() == null) {
		    throw new IllegalArgumentException("Coupon is invalid");
		}
		
		switch (coupon.getDiscountType()) {
	        case ORDER_VALUE_BASED:
	            if (order.getTotalPrice().compareTo(BigDecimal.valueOf(coupon.getMinimumOrderAmount())) >= 0) {
	                totalPrice = order.getTotalPrice().subtract(coupon.getDiscountValue());
	            } else {
	                throw new IllegalArgumentException("Order total price must be higher than coupon minimum amount");
	            }
	            break;
	
	        case PERCENTAGE:
	            BigDecimal discount = order.getTotalPrice().multiply(coupon.getDiscountValue().divide(BigDecimal.valueOf(100)));
	            totalPrice = order.getTotalPrice().subtract(discount);
	            break;
	
	        default:
	            throw new IllegalArgumentException("Unsupported discount type");
		}
		
		return totalPrice;
	}

	@Override
	public Order addNotes(UUID orderId, String notes) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Order> getOrdersByUserId(UUID userId) {
		User user = userService.findUserByUuId(userId);
		
		return user.getOrders();
	}

	@Override
	public Page<Order> getOrdersByStatus(OrderStatus status,int page, int size) {
		if(status == null) {
			throw new RuntimeException("Status is missing.");
		}
		
		Pageable pageable = PageRequest.of(page, size);
		return orderRepository.findByOrderStatus(status,pageable);
	}

	@Override
	public List<Order> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public BigDecimal calculateTotalShippingFee(UUID userId, LocalDateTime startDate, LocalDateTime endDate) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Order cancelOrder(UUID orderId) {
		Order order = getOrderById(orderId);
		
		order.setOrderStatus(OrderStatus.CANCELLED);
		
		return updateOrder(order);
	}

	@Override
	public List<Order> getPaidOrders() {
		
		return null;
	}

	@Override
	public BigDecimal calculateTotalPrice(Order order) {
		return order.getOrderItems().stream()
		        .map(orderItem -> {
		            BigDecimal price = 
		            		orderItem.getVariant() != null ? 
		            		((orderItem.getVariant().getDiscountPrice() != null && orderItem.getVariant().getDiscountPrice().doubleValue() > 0) ? orderItem.getVariant().getDiscountPrice() : orderItem.getVariant().getPrice() )  : BigDecimal.ZERO;
		            return price.multiply(BigDecimal.valueOf(orderItem.getQuantity()));
		        })
		        .reduce(BigDecimal.ZERO, BigDecimal::add);
	}

	@Override
	public Order updateTotalPrice(Order order) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Order updateTotalPriceWithCoupon(Order order, Coupon coupon) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Boolean isOrderEmpty(Order order) {
		return order.getOrderItems().isEmpty();
	}

	@Override
	public Optional<Order> findPendingOrderByUser(String email) {
		
		return orderRepository.findPendingOrderByUser(email);
	}

	@Override
	public Optional<Order> getOrderByCode(String code) {
		// TODO Auto-generated method stub
		return orderRepository.findByCode(code);
	}

	@Override
	public Page<Order> getOrdersWithPaginationAndSorting(int page, int size, String sortBy) {
		Pageable pageable = PageRequest.of(page, size);
		return orderRepository.findAll(pageable);
	}

	@Override
	public List<Order> getOrdersByUserEmail(String email) {
		User user = userService.findUserByEmail(email);
		return user != null ? user.getOrders() : List.of();
	}


}
