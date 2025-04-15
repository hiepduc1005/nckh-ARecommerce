package com.ecommerce.vn.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
	
	@Query("SELECT o FROM Order o WHERE o.orderStatus = :status ORDER BY o.createdAt DESC")
	Page<Order> findByOrderStatus(@Param("status") OrderStatus status, Pageable pageable);
	
	@Query("SELECT o FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate")
	List<Order> findOrdersByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
	
	@Query("SELECT o FROM Order o WHERE o.user.id = :userId AND o.createdAt BETWEEN :startDate AND :endDate")
	List<Order> findOrdersByUserIdAndDateRange(
			@Param("userId") UUID userId,
			@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate);

	@Query(value =  "SELECT EXISTS ( "
			+ "SELECT 1 FROM orders WHERE code = :code "
			+ ")", nativeQuery = true)
	Boolean isCodeExists(@Param("code") String code);

	  @Query("SELECT o FROM Order o WHERE o.orderStatus = 'PENDING' AND o.expiresAt <= :now")
	    List<Order> findExpiredOrders(@Param("now") LocalDateTime now);

	@Query("SELECT o FROM Order o WHERE o.user.email = :email AND o.orderStatus = 'PENDING' ")
	Optional<Order> findPendingOrderByUser(String email);

	Boolean existsByCode(String code);

	@Query("SELECT o FROM Order o WHERE o.code = :code ")
	Optional<Order> findByCode(String code);

}
