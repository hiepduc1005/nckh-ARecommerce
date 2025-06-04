package com.ecommerce.vn.dto.model;

import java.util.UUID;

import com.ecommerce.vn.entity.product.ItemType;

public class ModelCustomizeUpdateRequest {
	private UUID id;
	private String name;
	private Double price;
	private ItemType itemType;
	
	
	
	public UUID getId() {
		return id;
	}
	public void setId(UUID id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Double getPrice() {
		return price;
	}
	public void setPrice(Double price) {
		this.price = price;
	}
	public ItemType getItemType() {
		return itemType;
	}
	public void setItemType(ItemType itemType) {
		this.itemType = itemType;
	}
	
	
}
