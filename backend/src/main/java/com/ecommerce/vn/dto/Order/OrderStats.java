package com.ecommerce.vn.dto.order;

import java.math.BigDecimal;

public class OrderStats {
	
	private BigDecimal revenue; 
	private int totalOrders;
	public BigDecimal getRevenue() {
		return revenue;
	}
	public void setRevenue(BigDecimal revenue) {
		this.revenue = revenue;
	}
	public int getTotalOrders() {
		return totalOrders;
	}
	public void setTotalOrders(int totalOrders) {
		this.totalOrders = totalOrders;
	}

	
}
