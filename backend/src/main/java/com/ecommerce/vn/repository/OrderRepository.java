package com.ecommerce.vn.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.entity.order.Order;
import com.ecommerce.vn.entity.order.OrderStatus;

@Repository
public interface OrderRepository extends JpaRepository<Order,UUID>{
	
	@Query("SELECT o FROM Order o WHERE o.user.id = :userId")
	List<Order> findByUserId(@Param("userId") UUID userId);
	
	List<Order> findByOrderStatus(OrderStatus status);
	
	@Query("SELECT o FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate")
	List<Order> findOrdersByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
	
	@Query("SELECT o FROM Order o WHERE o.user.id = :userId AND o.createdAt BETWEEN :startDate AND :endDate")
	List<Order> findOrdersByUserIdAndDateRange(
			@Param("userId") UUID userId,
			@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate);

}
