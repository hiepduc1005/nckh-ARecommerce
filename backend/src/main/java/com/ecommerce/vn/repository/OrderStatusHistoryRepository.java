package com.ecommerce.vn.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.entity.order.OrderStatusHistory;

@Repository
public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, UUID>{

}
