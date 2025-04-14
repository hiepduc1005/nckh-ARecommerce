package com.ecommerce.vn.dto.order;

import java.time.LocalDateTime;
import java.util.UUID;

import com.ecommerce.vn.entity.order.OrderStatus;


public class OrderStatusHistoryResponse {
	private UUID id;

    private OrderStatus status;

    private LocalDateTime updatedAt;

    private String updatedBy;

    private String note;

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public OrderStatus getStatus() {
		return status;
	}

	public void setStatus(OrderStatus status) {
		this.status = status;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	public String getUpdatedBy() {
		return updatedBy;
	}

	public void setUpdatedBy(String updatedBy) {
		this.updatedBy = updatedBy;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}
    
    
}
