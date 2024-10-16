package com.ecommerce.vn.service.order.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.vn.entity.coupon.Coupon;
import com.ecommerce.vn.entity.order.Order;
import com.ecommerce.vn.entity.order.OrderItem;
import com.ecommerce.vn.entity.order.OrderStatus;
import com.ecommerce.vn.exception.ResourceEmptyException;
import com.ecommerce.vn.exception.ResourceNotFoundException;
import com.ecommerce.vn.repository.OrderRepository;
import com.ecommerce.vn.service.coupon.CouponService;
import com.ecommerce.vn.service.order.OrderService;


public class OrderServiceImpl implements OrderService {
	
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private CouponService couponService;
    

    @Override
    @Transactional
    public Order createOrder(Order order ,String couponCode) {
    	if(isOrderEmpty(order)) {
    		throw new ResourceEmptyException("Order");
    	}
    	
    	Order orderAfterSetTotalPrice = updateTotalPrice(order);
    	if(!couponCode.trim().isEmpty()) {
    		Coupon coupon = couponService.validateAndRetrieveCouponByCode(couponCode, orderAfterSetTotalPrice.getTotalPrice());  
    		orderAfterSetTotalPrice = updateTotalPriceWithCoupon(orderAfterSetTotalPrice, coupon);
    	}    	
    	return orderRepository.save(orderAfterSetTotalPrice);    		
    }

    @Override
    public Order getOrderById(UUID orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderId", orderId));
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    @Transactional
    public Order updateOrder(Order updatedOrder) {
        return orderRepository.save(updatedOrder);
    }

    @Override
    @Transactional
    public void deleteOrder(UUID orderId) {
    	Order order = getOrderById(orderId);
        orderRepository.delete(order);
    }

    @Override
    @Transactional
    public Order updateOrderStatus(UUID orderId, OrderStatus orderStatus) {
        Order order = getOrderById(orderId);
        order.setOrderStatus(orderStatus);
        return orderRepository.save(order);
    }

    @SuppressWarnings("null")
    @Override
    @Transactional
    public Order addCouponToOrder(UUID orderId, Coupon coupon) {
        Order order = getOrderById(orderId);
//        if (coupon == null) {
//            throw new ResourceNotFoundException("Coupon", "id", coupon.getId());
//        }
//        order.setCoupon(coupon);
//        BigDecimal discountAmount = coupon.getDiscountValue(); 
//        BigDecimal totalAmount = calculateTotalAmount(orderId);
//        order.setTotalAmount(totalAmount.subtract(discountAmount));
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public BigDecimal calculateTotalPriceWithCoupon(UUID orderId, UUID couponId) {
        Order order = getOrderById(orderId);
        BigDecimal totalAmount = BigDecimal.ZERO;

        Set<OrderItem> orderItems = order.getOrderItems();
        totalAmount = orderItems.stream()
        		.map(
        				orderItem -> 
        					orderItem
        						.getVariant()
        						.getPrice()
        						.multiply(new BigDecimal(orderItem.getQuantity())))
        		.reduce(BigDecimal.ZERO,BigDecimal::add);

        totalAmount = totalAmount.add(order.getShippingFee());
        
        totalAmount = couponService.getTotalPriceAfterDiscount(couponId, totalAmount);
        
        return totalAmount;
    }
    
    @Override
    @Transactional
    public BigDecimal calculateTotalPrice(Order order) {
    	 BigDecimal totalAmount = BigDecimal.ZERO;

         Set<OrderItem> orderItems = order.getOrderItems();
         totalAmount = orderItems.stream()
         		.map(
         				orderItem -> 
         					orderItem
         						.getVariant()
         						.getPrice()
         						.multiply(new BigDecimal(orderItem.getQuantity())))
         		.reduce(BigDecimal.ZERO,BigDecimal::add);

         totalAmount = totalAmount.add(order.getShippingFee());

         return totalAmount;
    }
    
    @Transactional
    @Override
    public Order updateTotalPrice(Order order) {
    	 BigDecimal totalPrice = calculateTotalPrice(order);
    	 order.setTotalPrice(totalPrice);
    	return order;
    }

    @Override
    public Order updateTotalPriceWithCoupon(Order order, Coupon coupon) {
    	BigDecimal totalPrice = calculateTotalPriceWithCoupon(order.getId(),coupon.getId());
	   	order.setTotalPrice(totalPrice);
	   	order.setCoupon(coupon);
	   	return order;
    }
    
    
    @Override
    @Transactional
    public Order addNotes(UUID orderId, String notes) {
        Order order = getOrderById(orderId);
        order.setNotes(notes);
        return orderRepository.save(order);
    }

	@Override
	@Transactional(readOnly = true)
	public List<Order> getOrdersByUserId(UUID userId) {
		
		return orderRepository.findByUserId(userId);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Order> getOrdersByStatus(OrderStatus status) {
		// TODO Auto-generated method stub
		return orderRepository.findByOrderStatus(status);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Order> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
		// TODO Auto-generated method stub
		return orderRepository.findOrdersByDateRange(startDate, endDate);
	}

	@Override
	@Transactional
	public BigDecimal calculateTotalShippingFee(UUID userId, LocalDateTime startDate, LocalDateTime endDate) {
		List<Order> orders = orderRepository.findOrdersByUserIdAndDateRange(userId, startDate, endDate);
		
		BigDecimal totalShippingFee = orders.stream()
				.map(Order::getShippingFee)
				.reduce(BigDecimal.ZERO,BigDecimal::add);
				
		return totalShippingFee;
	}

	@Override
	@Transactional
	public Order cancelOrder(UUID orderId) {	
		   Order order = orderRepository.findById(orderId)
		            .orElseThrow(() -> new ResourceNotFoundException("Order","orderId",orderId)); // Kiểm tra đơn hàng

		    // Kiểm tra trạng thái đơn hàng trước khi hủy
		    if (order.getOrderStatus() == OrderStatus.SHIPPED || order.getOrderStatus() == OrderStatus.DELIVERED) {
		        throw new IllegalStateException("Không thể hủy đơn hàng đã được giao hoặc đang vận chuyển");
		    }
		    
		    // Kiểm tra trạng thái đơn hàng trước khi hủy
		    if (order.getOrderStatus() == OrderStatus.REJECTED || order.getOrderStatus() == OrderStatus.RETURNED) {
		        throw new IllegalStateException("Không thể hủy đơn hàng đã được tra lai hoac da bi tu choi");
		    }

		    // Cập nhật trạng thái đơn hàng thành CANCELED
		    order.setOrderStatus(OrderStatus.CANCELED);
		    return orderRepository.save(order); // Lưu lại thay đổi
	}

	@Override
	@Transactional
	public List<Order> getPaidOrders() {
		return getOrdersByStatus(OrderStatus.PAID);
	}

	@Override
	public Boolean isOrderEmpty(Order order) {
		return order.getOrderItems().isEmpty();
	}

}
