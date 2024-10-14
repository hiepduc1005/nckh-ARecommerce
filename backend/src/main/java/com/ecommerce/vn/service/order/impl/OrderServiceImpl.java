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
import com.ecommerce.vn.exception.ResourceNotFoundException;
import com.ecommerce.vn.repository.OrderRepository;
import com.ecommerce.vn.service.order.OrderService;

public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Override
    @Transactional
    public Order createOrder(Order order) {
        order.setCreatedAt(LocalDateTime.now());
        // Tính tổng giá trị đơn hàng nếu có thể
        BigDecimal totalAmount = calculateTotalAmount(order.getId());
        order.setTotalAmount(totalAmount);
        return orderRepository.save(order);
    }

    @Override
    public Order getOrderById(UUID orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    @Transactional
    public Order updateOrder(UUID orderId, Order updatedOrder) {
        Order existingOrder = getOrderById(orderId);
        existingOrder.setOrderStatus(updatedOrder.getOrderStatus());
        existingOrder.setShippingMethod(updatedOrder.getShippingMethod());
        existingOrder.setPaymentMethod(updatedOrder.getPaymentMethod());
        existingOrder.setShippingFee(updatedOrder.getShippingFee());
        existingOrder.setNotes(updatedOrder.getNotes());
        existingOrder.setOrderItems(updatedOrder.getOrderItems());
        return orderRepository.save(existingOrder);
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
        if (coupon == null) {
            throw new ResourceNotFoundException("Coupon", "id", coupon.getId());
        }
        order.setCoupon(coupon);
        BigDecimal discountAmount = coupon.getDiscountValue();
        BigDecimal totalAmount = calculateTotalAmount(orderId);
        order.setTotalAmount(totalAmount.subtract(discountAmount));
        return orderRepository.save(order);
    }

    @Override
    public BigDecimal calculateTotalAmount(UUID orderId) {
        Order order = getOrderById(orderId);
        BigDecimal totalAmount = BigDecimal.ZERO;

        Set<OrderItem> orderItems = order.getOrderItems();
        for (OrderItem item : orderItems) {
            totalAmount = totalAmount.add(item.getTotalPrice());
        }

        totalAmount = totalAmount.add(order.getShippingFee());
        if (order.getDiscount() != null) {
            totalAmount = totalAmount.subtract(order.getDiscount());
        }
        return totalAmount;
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
}
